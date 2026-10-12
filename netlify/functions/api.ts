import serverless from 'serverless-http';
import { app } from '../../serverApp.ts';

export const handler = serverless(app);
