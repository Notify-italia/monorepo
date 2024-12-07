import { Router } from 'express';
import { getGooglePassRouter } from './get.google-pass';
import { getPkpassRouter } from './get.pkpass';

const router = Router();

router.use('/pkpass', getPkpassRouter);
router.use('/google-pass', getGooglePassRouter);

export { router as walletRouter };
