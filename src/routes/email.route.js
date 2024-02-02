import express from 'express';
import * as emailController from '../controllers/email.controlles.js';
import { catchError } from '../utils/catchError.js';

export const router = express.Router();

router.get('/', catchError(emailController.get));
router.post('/', catchError(emailController.create));
router.delete('/', catchError(emailController.remove));
