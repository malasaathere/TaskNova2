const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (to, name, tempPassword) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Welcome to Task Management System',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Your account has been created. Please log in with the credentials below:</p>
      <p><strong>Email:</strong> ${to}</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      <p><strong>You must reset your password on first login.</strong></p>
      <p>Login at: ${process.env.FRONTEND_URL}/login</p>
    `,
  });
};

const sendPasswordResetEmail = async (to, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your TMS Password Was Reset',
    html: `<h2>Hi ${name},</h2><p>Your password has been successfully updated.</p>`,
  });
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
