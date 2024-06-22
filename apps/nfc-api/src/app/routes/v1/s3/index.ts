import { Router } from 'express';
import { postTempFileRouter } from './post.temp';

const router = Router();

router.use('/temp', postTempFileRouter);

export { router as s3Router };
