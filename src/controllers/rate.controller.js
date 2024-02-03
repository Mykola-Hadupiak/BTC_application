import * as rateService from '../services/rate.service.js';
import { exchangeRateGauge } from '../services/prometheus-metrics.js';

export const get = async(req, res) => {
  const rate = await rateService.getRate();

  exchangeRateGauge.set(rate);

  res.status(200)
    .json({ rate });
};

export const post = async(req, res) => {
  const [sended, errors] = await rateService.sendEmails();

  res.status(200)
    .json({
      message: 'Rate successfully sent to active subscriptions',
      emails: sended,
      errors,
    });
};
