export default function DeveloperFAQ() {
    return (
        <section className="dev-section faq-section">
            <div className="dev-container">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h4>01. How can I sign up for an API account?</h4>
                        <p>
                            You can sign up for the developer API by entering your name and email address above.
                            After registration, an activation email will be sent to your email address. By clicking
                            the button within this email, you will be logged in and directed to the dashboard right away.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h4>02. Is there a maximum file size limit?</h4>
                        <p>
                            To ensure optimal service quality, the API imposes certain limitations. The maximum file
                            size permitted is 100MB for Enterprise plans, and images should not surpass a maximum
                            canvas size of 256MP (32000 pixels in width or height).
                        </p>
                    </div>

                    <div className="faq-item">
                        <h4>03. Can I use one API account for multiple websites?</h4>
                        <p>
                            In the API dashboard, you can easily create new API keys. We recommend using different
                            API keys for different implementations so that you can monitor the number of compressions separately.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h4>04. Can Shrinkix see what images I have uploaded?</h4>
                        <p>
                            At Shrinkix, we take your privacy seriously, so we can't see the content of your images.
                            Only a minimum of personal information is collected and used to administer your account
                            and to provide you with the requested products and services.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
