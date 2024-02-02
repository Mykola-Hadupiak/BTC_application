import express from 'express';
import { catchError } from '../utils/catchError.js';
import * as rateController from '../controllers/rate.controller.js';

export const router = express.Router();

router.get('/', catchError(rateController.get));
router.post('/', catchError(rateController.post));
