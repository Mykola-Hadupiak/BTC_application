import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

function send({ email, subject, html }) {
  return transporter.sendMail({
    to: email,
    subject,
    html,
  });
}

function sendEmailWithRate({ email, subject, currentRate }) {
  const normalizedRate = currentRate.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const html = `
    Current Rate: ${normalizedRate} UAH
  `;

  return send({
    email,
    html,
    subject,
  });
}

export const nodemailerService = {
  sendEmailWithRate,
};
