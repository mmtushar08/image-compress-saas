const nodemailer = require('nodemailer');
const process = require('process');
const logger = require('../utils/logger');

// Config
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.ethereal.email';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER || 'ethereal_user'; // Mock if not provided
const SMTP_PASS = process.env.SMTP_PASS || 'ethereal_pass';
const FROM_EMAIL = process.env.EMAIL_FROM || process.env.SMTP_USER || '"Shrinkix Support" <support@shrinkix.com>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Create Transporter
// In production, we'd want a real SMTP service. 
// For dev without keys, we can use Ethereal or just log.
// If valid keys aren't present, we'll assume "log only" or Ethereal for now.
let transporter;

if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });
} else {
    // Fallback for development if no env vars set
    // We will just create a "JSON transport" or Ethereal test account if needed
    // But for "like that" visuals, we might want to actually GENERATE the html to see it.
    logger.warn('No SMTP config found — emails will be mocked/logged');
    transporter = {
        sendMail: async (mailOptions) => {
            logger.info('MOCK EMAIL', {
                to: mailOptions.to,
                subject: mailOptions.subject,
                text: mailOptions.text || mailOptions.html?.substring(0, 120)
            });
            return { messageId: 'mock-id' };
        }
    };
}

// STYLES & TEMPLATE
const getTemplate = (content, actionButton, isMagicLink = false) => {
    const footerText = isMagicLink
        ? `
        <p>This link is valid for 24 hours. You can always request a new link on the website to access your account again. If you have any questions or feedback, do not hesitate to reply to this email or send us an email at oxi@shrinkix.com.</p>
        <p>Have a great day!</p>
        <p>Team shrinkix,</p>
        `
        : `
        <p>Have a wonderful day!</p>
        <p><em>Team Shrinkix</em></p>
        <div class="footer">
            <p>This email was sent to you because you signed up for Shrinkix.</p>
        </div>
        `;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shrinkix Notification</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f2f5f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #eef2f5; padding: 20px; text-align: center; border-bottom: 1px solid #e1e4e8; position: relative; overflow: hidden; }
        /* Simulating the sky/grass header from TinyPNG */
        .header-bg { background: linear-gradient(to bottom, #dbebf0 0%, #ffffff 100%); padding: 40px 0; }
        .logo { font-size: 24px; font-weight: bold; color: #333; background: #fff; padding: 8px 16px; border-radius: 20px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .content { padding: 40px; color: #4a4a4a; line-height: 1.6; font-size: 16px; }
        .btn { display: inline-block; background-color: #8cc63f; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-weight: bold; font-size: 16px; margin: 20px 0; text-align: center; }
        .btn:hover { background-color: #7ab332; }
        .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #888; font-size: 12px; }
        .link { color: #0099e5; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header-bg" style="text-align: center;">
            <div class="logo">Shrinkix</div>
        </div>
        <div class="content">
            ${content}
            ${actionButton ? `<div style="text-align: center;">${actionButton}</div>` : ''}
            ${footerText}
        </div>
    </div>
</body>
</html>
    `;
};

exports.sendWelcomeEmail = async (email, dashboardLink, name = 'there') => {
    const link = dashboardLink || `${FRONTEND_URL}/dashboard`;
    const greeting = name && name !== 'there' ? name : 'there';

    const content = `
        <p>Hi ${greeting},</p>
        <p>Welcome to Shrinkix! Your account is ready.</p>
        <p>Click the button below to access your dashboard and API key.</p>
        <p>You can always log back in by entering your email on the sign-in page.</p>
    `;

    const button = `<a href="${link}" class="btn">Visit your dashboard</a>`;

    const html = getTemplate(content, button);

    try {
        await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: 'Get your Shrinkix API key',
            html: html,
            text: `Here is the link to your dashboard: ${link}` // Fallback
        });
        logger.info('Welcome email sent', { email });
        return true;
    } catch (error) {
        logger.error('Failed to send welcome email', { email, error: error.message });
        return false;
    }
};

exports.sendMagicLink = async (email, magicLink, name = 'there') => {
    const content = `
        <p>Hi ${name},</p>
        <p>You requested a link to log in to your account. Go check it out!</p>
    `;
    const button = `<a href="${magicLink}" class="btn">Log in with magic link</a>`;
    const html = getTemplate(content, button, true); // Pass true to include footer

    try {
        await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: 'Log in to your account',
            html: html
        });
        return true;
    } catch (error) {
        logger.error('Failed to send magic link email', { email, error: error.message });
        return false;
    }
};

exports.sendAdminNewUserNotification = async (userEmail, userName, plan) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return; // silently skip if not configured

    const content = `
        <p>A new user has registered on Shrinkix.</p>
        <table style="border-collapse:collapse;width:100%;font-size:15px;">
            <tr><td style="padding:6px 12px;color:#888;">Name</td><td style="padding:6px 12px;"><strong>${userName || '—'}</strong></td></tr>
            <tr><td style="padding:6px 12px;color:#888;">Email</td><td style="padding:6px 12px;"><strong>${userEmail}</strong></td></tr>
            <tr><td style="padding:6px 12px;color:#888;">Plan</td><td style="padding:6px 12px;"><strong>${plan}</strong></td></tr>
            <tr><td style="padding:6px 12px;color:#888;">Time</td><td style="padding:6px 12px;">${new Date().toUTCString()}</td></tr>
        </table>
    `;
    const button = `<a href="${FRONTEND_URL}/admin" class="btn">View in Admin</a>`;
    const html = getTemplate(content, button);

    try {
        await transporter.sendMail({
            from: FROM_EMAIL,
            to: adminEmail,
            subject: `New signup: ${userName || userEmail} (${plan})`,
            html,
            text: `New signup — Name: ${userName || '—'}, Email: ${userEmail}, Plan: ${plan}`
        });
    } catch (error) {
        logger.error('Failed to send admin notification', { error: error.message });
    }
};

exports.sendLimitReachedEmail = async (email, plan) => {
    const content = `
        <p>Hi there,</p>
        <p>You have reached the usage limit for your <strong>${plan}</strong> plan.</p>
        <p>To continue compressing images without interruption, please upgrade your subscription.</p>
    `;
    const button = `<a href="${FRONTEND_URL}/pricing" class="btn">Upgrade Now</a>`;
    const html = getTemplate(content, button);

    try {
        await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: 'Usage Limit Reached - Shrinkix',
            html: html
        });
        logger.info('Limit reached email sent', { email });
        return true;
    } catch (error) {
        logger.error('Failed to send limit reached email', { email, error: error.message });
        return false;
    }
};
