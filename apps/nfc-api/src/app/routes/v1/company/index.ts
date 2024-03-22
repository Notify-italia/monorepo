import { Router } from 'express';
import { companyPasswordRouter } from './password';
import { patchCompanyRouter } from './patch.company';
import { patchLicenseCompanyRouter } from './patch.license';
import { postCompanyRouter } from './post';
import { postLicenseCompanyRouter } from './post.license';
import { postRefreshCompanyRouter } from './post.refresh';
import { postSigninCompanyRouter } from './post.signin';

const router = Router();

router.use('/', postCompanyRouter);
router.use('/', patchCompanyRouter);
router.use('/password', companyPasswordRouter);
router.use('/signin', postSigninCompanyRouter);
router.use('/license', patchLicenseCompanyRouter);
router.use('/license', postLicenseCompanyRouter);
router.use('/refresh', postRefreshCompanyRouter);

export { router as companyRouter };
