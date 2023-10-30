//boilerplate for an express app
import express from 'express';
import { api } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', api);

export default app;
