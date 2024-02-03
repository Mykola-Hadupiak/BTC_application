import axios from 'axios';
import cron from 'node-cron';
import { Rate } from '../models/rate.js';
import { ApiError } from '../exeptions/api.error.js';
import { nodemailerService } from './nodemailer.service.js';
import { exchangeRateGauge } from './prometheus-metrics.js';

const BTC_API = 'https://btc-trade.com.ua/api/ticker/btc_uah';

const DAILY_MINUTES = '0';
const DAILY_HOURES = '9';

const CHECK_HOURLY = '0';

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
  try {
    const response = await axios.get(BTC_API);
    const currentRate = parseFloat(response.data.btc_uah.buy);

    if (isNaN(currentRate)) {
      throw ApiError.notFound('Rate is not valid', {
        rate: 'Invalid BTC UAH rate value',
      });
    }
    await Rate.create({ value: currentRate });
  } catch (error) {
    throw ApiError.badRequest('Something went wrong with API',
      { rate: 'Cannot get rate from API' });
  }
};

export const getRate = async() => {
  await getRateFromServer();

  const latesRate = await getLatestRate();

  return latesRate;
};

export const sendEmails = async() => {
  const currentRate = await getRate();

  exchangeRateGauge.set(currentRate);

  const [sended, errors] = await nodemailerService
    .sendEmailToSubscribedUsers(currentRate);

  return [sended, errors];
};

cron.schedule(`${DAILY_MINUTES} ${DAILY_HOURES} * * *`, async() => {
  const [sended, errors] = await sendEmails();

  // eslint-disable-next-line no-console
  console.log({
    // eslint-disable-next-line max-len
    message: 'Rate successfully sent to active subscriptions at 9:00 AM Kyiv time',
    emails: sended,
    errors,
  });
});

cron.schedule(`${CHECK_HOURLY} * * * *`, async() => {
  const lastRate = await getLatestRate();

  const currentRate = await getRate();

  if (Math.abs(currentRate - lastRate) > (lastRate * 0.05)) {
    const [sended, errors] = await nodemailerService
      .sendEmailToSubscribedUsers(currentRate);

    // eslint-disable-next-line no-console
    console.log({
      // eslint-disable-next-line max-len
      message: 'Rate successfully sent to active subscriptions (rate changed more than 5%)',
      emails: sended,
      errors,
    });
  }
});
