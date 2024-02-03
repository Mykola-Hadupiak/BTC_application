import { Registry, collectDefaultMetrics, Counter, Gauge } from 'prom-client';

const registry = new Registry();

collectDefaultMetrics({ register: registry });

const emailSubscribeCount = new Counter({
  name: 'email_subscribe_count',
  help: 'Number of email subscriptions',
  registers: [registry],
});

const emailUnsubscribeCount = new Counter({
  name: 'email_unsubscribe_count',
  help: 'Number of email unsubscriptions',
  registers: [registry],
});

const emailSendCount = new Counter({
  name: 'email_send_count',
  help: 'Number of emails sent',
  registers: [registry],
});

const emailSendErrorCount = new Counter({
  name: 'email_send_error_count',
  help: 'Number of email sending errors',
  registers: [registry],
});

const exchangeRateGauge = new Gauge({
  name: 'exchange_rate',
  help: 'Current exchange rate',
  registers: [registry],
});

export {
  registry,
  emailSubscribeCount,
  emailUnsubscribeCount,
  emailSendCount,
  emailSendErrorCount,
  exchangeRateGauge,
};
