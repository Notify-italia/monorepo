import { Router } from 'express';
import { postCompanyRouter } from './post';

const router = Router();

router.use('/', postCompanyRouter);

export { router as companyRouter };
