import express from 'express';
import { postStatRouter } from './post';

const router = express.Router();

router.use('/', postStatRouter);

export { router as statRouter };
