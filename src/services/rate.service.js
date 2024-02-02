import axios from 'axios';
import cron from 'node-cron';
import { Rate } from '../models/rate.js';
import { Email } from '../models/email.js';
import { ApiError } from '../exeptions/api.error.js';
import { nodemailerService } from './nodemailer.service.js';

const BTC_API = 'https://btc-trade.com.ua/api/ticker/btc_uah';

export const getLatestRate = async() => {
  const latestRate = await Rate.findOne({
    order: [
      ['updatedAt', 'DESC'],
    ],
  });

  if (!latestRate) {
    throw ApiError.notFound('Cannot find rate', {
      rate: 'Rate doesnt found',
    });
  }

  return latestRate.value;
};

const getRateFromServer = async() => {
  const response = await axios.get(BTC_API);
  const currentRate = parseFloat(response.data.btc_uah.buy);

  if (isNaN(currentRate)) {
    throw ApiError.notFound('Rate is not valid', {
      rate: 'Invalid BTC UAH rate value',
    });
  }

  await Rate.create({ value: currentRate });
};

export const getRate = async() => {
  await getRateFromServer();

  const latesRate = await getLatestRate();

  return latesRate;
};

async function sendEmailToSubscribedUsers(currentRate) {
  const subscribedEmails = await Email.findAll({
    where: { status: 'subscribed' },
  });

  const errors = [];
  const sended = [];

  for (const email of subscribedEmails) {
    try {
      await nodemailerService.sendEmailWithRate({
        email: email.email,
        subject: 'BTC UAH Exchange Rate Update',
        currentRate,
      });

      sended.push(email.email);
    } catch (error) {
      errors.push(email.email);

      continue;
    }
  }

  return [sended, errors];
}

export const sendEmails = async() => {
  const currentRate = await getRate();

  const [sended, errors] = await sendEmailToSubscribedUsers(currentRate);

  return [sended, errors];
};

cron.schedule('0 9 * * *', async() => {
  const [sended, errors] = await sendEmails();

  // eslint-disable-next-line no-console
  console.log({
    // eslint-disable-next-line max-len
    message: 'Rate successfully sent to active subscriptions at 9:00 AM Kyiv time',
    emails: sended,
    errors,
  });
});

cron.schedule('0 * * * *', async() => {
  const lastRate = await getLatestRate();

  const currentRate = await getRate();

  if (Math.abs(currentRate - lastRate) > (lastRate * 0.05)) {
    const [sended, errors] = await sendEmails();

    // eslint-disable-next-line no-console
    console.log({
      // eslint-disable-next-line max-len
      message: 'Rate successfully sent to active subscriptions (rate changed more than 5%)',
      emails: sended,
      errors,
    });
  }
});
