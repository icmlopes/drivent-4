import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';

import { loadEnv, connectDb, disconnectDB } from '@/config';

loadEnv();

import { handleApplicationErrors } from '@/middlewares';
import * as R from '@/routers';

const app = express();
app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK!'))
  .use('/users', R.usersRouter)
  .use('/auth', R.authenticationRouter)
  .use('/event', R.eventsRouter)
  .use('/enrollments', R.enrollmentsRouter)
  .use('/tickets', R.ticketsRouter)
  .use('/payments', R.paymentsRouter)
  .use('/hotels', R.hotelsRouter)
  .use('/booking', R.bookingRouter)
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
