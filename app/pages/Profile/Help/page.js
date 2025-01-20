import React from 'react';

function Help() {
  return (
    <div className="help-page">
        <div className="help-page-container">
      <h1 className="help-page__title">Help</h1>

      <section className="help-page__section">
        <h2>Returns and Refunds</h2>
        <p>
          <a href="/return-policy">What is your return policy?</a><br />
          We offer hassle-free returns within 2 days of purchase for most items. For details, visit our Return & Refund Policy.
        </p>
        <ul>
          <li>
            <strong>How do I initiate a return?</strong><br />
            Contact our customer support team at <a href="mailto:support@yourpetshop.com">support@yourpetshop.com</a> with your order details, and we’ll guide you through the process.
          </li>
          <li>
            <strong>When will I receive my refund?</strong><br />
            Refunds are typically processed within 3 business days after we receive and inspect the returned item.
          </li>
        </ul>
      </section>

      <section className="help-page__section">
        <h2>Account and Membership</h2>
        <ul>
          <li>
            <strong>Do I need an account to shop?</strong><br />
            No, you can check out as a guest. However, creating an account allows you to track orders, save your preferences, and enjoy exclusive offers.
          </li>
          <li>
            <strong>I forgot my password. How can I reset it?</strong><br />
            Click on the "Forgot Password?" link on the login page, and follow the instructions to reset your password.
          </li>
        </ul>
      </section>

      <section className="help-page__section">
        <h2>Still Need Help?</h2>
        <p>
          If you didn’t find the answers you were looking for, please don’t hesitate to get in touch! Our dedicated team is here to assist you with any questions or concerns.
        </p>
        <ul>
          <li><strong>Email Us:</strong> <a href="mailto:support@yourpetshop.com">support@yourpetshop.com</a></li>
          <li><strong>Call Us:</strong> 1234567890</li>
          <li><strong>Business Hours:</strong> 10:00 A.M - 07:00 P.M</li>
        </ul>
        <p>
          Thank you for choosing us. We look forward to serving you and your furry, feathered, or scaly friends!
        </p>
      </section>
      </div>
    </div>
  );
}

export default Help;
