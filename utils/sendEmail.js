// backend/utils/sendEmail.js

const nodemailer = require("nodemailer");

/**
 * Sends an email using Nodemailer.
 *
 * @param {object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject line.
 * @param {string} options.text - Plain text body (optional).
 * @param {string} options.html - HTML body (optional).
 */
const sendEmail = async (options) => {
  // 1. Create a Nodemailer transporter
  // We use environment variables to store sensitive credentials securely.
  const transporter = nodemailer.createTransport({
    // Service (e.g., 'gmail', 'SendGrid', etc.) or Host/Port configuration
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
    // If not using a well-known service, you would configure host and port:
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    // secure: true, // true for 465, false for other ports
  });

  // 2. Define email details
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Sender address
    to: options.to,
    subject: options.subject,
    html: options.text, // The 'text' variable from authController is HTML in this case
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
  console.log(`Email sent successfully to: ${options.to}`);
};

module.exports = sendEmail;
