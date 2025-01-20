import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
         <div className="privacy-container">
      <h1 className="privacy-policy__title">Privacy and Policy</h1>
      <section className="privacy-policy__section">
        <h2>Information We Collect</h2>
        <p>We collect various types of information to provide and improve our services to you, including:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> This may include your name, email address, shipping address,
            payment information, and phone number, collected when you make a purchase, sign up for our newsletter, or create an account.
          </li>
          <li>
            <strong>Non-Personal Information:</strong> Information that does not identify you, such as browser type,
            device information, and IP address, collected through cookies and other tracking technologies.
          </li>
          <li>
            <strong>Pet Information:</strong> When relevant, we may collect details about your pets to better tailor
            our products and services to your needs (e.g., pet breed, age, dietary preferences).
          </li>
        </ul>
      </section>
      <section className="privacy-policy__section">
        <h2>How We Use Your Information</h2>
        <p>We use your information for various purposes, including:</p>
        <ul>
          <li>Processing and managing your purchases and orders</li>
          <li>Improving our website and user experience</li>
          <li>Responding to your inquiries and customer service requests</li>
          <li>Sending promotional emails and updates (with your consent)</li>
          <li>Personalizing your experience and offering tailored product recommendations</li>
        </ul>
      </section>
      <section className="privacy-policy__section">
        <h2>How We Share Your Information</h2>
        <p>
          We do not sell or share your personal information with third parties for marketing purposes. However, we may
          share information with:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> We work with third-party service providers to facilitate our services,
            such as payment processors, shipping companies, and marketing partners.
          </li>
          <li>
            <strong>Legal Obligations:</strong> We may disclose your information if required by law, such as responding
            to subpoenas, court orders, or other legal processes.
          </li>
        </ul>
      </section>
      <section className="privacy-policy__section">
        <h2>Cookies and Tracking Technologies</h2>
        <p>
          Our website uses cookies and similar tracking technologies to improve your browsing experience and analyze
          site traffic. Cookies are small files stored on your device that help us remember your preferences, analyze
          usage, and customize content. You can manage your cookie preferences through your browser settings.
        </p>
      </section>
    </div>
    </div>
  );
}

export default PrivacyPolicy;
