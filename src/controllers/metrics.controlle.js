import { ApiError } from '../exeptions/api.error.js';
import { registry } from '../services/prometheus-metrics.js';

export const getMetrics = async(req, res) => {
  try {
    res.set('Content-Type', registry.contentType);

    const metrics = await registry.metrics();

    res.end(metrics);
  } catch (error) {
    throw ApiError.notFound('Cannot get metrics', {
      metrics: 'Metrics not found',
    });
  }
};
