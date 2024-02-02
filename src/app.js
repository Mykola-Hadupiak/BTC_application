/* eslint-disable no-console */
import express from 'express';
import 'dotenv/config';
import { router as emailRouter } from './routes/email.route.js';
import { router as rateRouter } from './routes/rate.route.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.json());
app.use('/api/emails', express.json(), emailRouter);
app.use('/api/rate', express.json(), rateRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
