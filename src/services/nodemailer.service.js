import 'dotenv/config';
import nodemailer from 'nodemailer';
import { ApiError } from '../exeptions/api.error.js';
import { Email } from '../models/email.js';
import {
  emailSendCount,
  emailSendErrorCount,
} from './prometheus-metrics.js';

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

async function sendEmailToSubscribedUsers(currentRate) {
  const subscribedEmails = await Email.findAll({
    where: { status: 'subscribed' },
  });

  const errors = [];
  const sended = [];

  if (subscribedEmails.length === 0) {
    throw ApiError.cannotPost('There are no subscribed emails');
  }

  for (const email of subscribedEmails) {
    try {
      await nodemailerService.sendEmailWithRate({
        email: email.email,
        subject: 'BTC UAH Exchange Rate Update',
        currentRate,
      });

      emailSendCount.inc();
      sended.push(email.email);
    } catch (error) {
      errors.push(email.email);
      emailSendErrorCount.inc();

      continue;
    }
  }

  return [sended, errors];
}

export const nodemailerService = {
  sendEmailWithRate,
  sendEmailToSubscribedUsers,
};
