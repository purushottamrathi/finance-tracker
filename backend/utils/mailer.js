const nodemailer = require('nodemailer');

let transporter = null;
function createTransporterFromEnv() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = port === 465;
  return nodemailer.createTransport({ host, port, secure, auth: user ? { user, pass } : undefined });
}

function getTransporter() {
  if (transporter) return transporter;
  transporter = createTransporterFromEnv();
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  const t = getTransporter();
  if (!t) {
    console.log('Mailer not configured. Skipping sendMail to', to, 'subject:', subject);
    return false;
  }
  try {
    await t.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com', to, subject, text, html });
    return true;
  } catch (err) {
    console.error('sendMail failed', err);
    return false;
  }
}

module.exports = { sendMail };
