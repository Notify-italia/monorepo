import { Router } from 'express';
import { postCompanyPasswordRecoverRouter } from './post.recover';
import { postCompanyPasswordUpdateRouter } from './post.update';

const router = Router();

router.use('/recover', postCompanyPasswordRecoverRouter);
router.use('/update', postCompanyPasswordUpdateRouter);

export { router as companyPasswordRouter };
