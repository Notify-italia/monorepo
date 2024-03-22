import express from 'express';
import { getStatRouter } from './get';
import { postStatRouter } from './post';
import { postStatCounterRouter } from './post.counter';

const router = express.Router();

router.use('/', postStatRouter);
router.use('/counter', postStatCounterRouter);
router.use('/', getStatRouter);

export { router as statRouter };
