const nodemailer = require('nodemailer');
const config = require('../config/env');

// With no EMAIL_HOST (development) the email is printed in the terminal instead of sent.
const useConsole = !config.mail.host;

const transporter = useConsole
  ? nodemailer.createTransport({ jsonTransport: true })
  : nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.secure,
      auth: config.mail.user ? { user: config.mail.user, pass: config.mail.pass } : undefined,
    });

const sendEmail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({ from: config.mail.from, to, subject, text, html });
  if (useConsole) console.log(`\n[email to ${to}] ${subject}\n${text}\n`);
};

module.exports = sendEmail;
