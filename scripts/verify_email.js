const { sendMagicLink } = require('../api/services/emailService');

async function test() {
    console.log("Testing Magic Link Email...");
    await sendMagicLink('test@example.com', 'http://localhost:5173/verify?token=123', 'Tushar Makawana');
}

test();
