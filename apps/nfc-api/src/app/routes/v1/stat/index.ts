import express from 'express';
import { getStatRouter } from './get';
import { postStatRouter } from './post';

const router = express.Router();

router.use('/', postStatRouter);
router.use('/', getStatRouter);

export { router as statRouter };
