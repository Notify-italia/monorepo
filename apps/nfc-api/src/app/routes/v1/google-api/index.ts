import { Router } from 'express';
import { getGooglePlaceIdRouter } from './get.place-id';

const router = Router();

router.use('/place-id', getGooglePlaceIdRouter);

export { router as googleAPIRouter };
