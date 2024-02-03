import express from 'express';
import { catchError } from '../utils/catchError.js';
import * as metricsController from '../controllers/metrics.controlle.js';

export const router = express.Router();

router.get('/', catchError(metricsController.getMetrics));
