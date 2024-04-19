import { Router } from 'express';

import { getCompanyRouter } from './get';
import { companyPasswordRouter } from './password';
import { patchCompanyRouter } from './patch.company';
import { patchLicenseCompanyRouter } from './patch.license';
import { postCompanyRouter } from './post';
import { postRefreshCompanyRouter } from './post.refresh';
import { postSigninCompanyRouter } from './post.signin';

const router = Router();

router.use('/', postCompanyRouter);
router.use('/', patchCompanyRouter);
router.use('/', getCompanyRouter);
router.use('/password', companyPasswordRouter);
router.use('/signin', postSigninCompanyRouter);
router.use('/license', patchLicenseCompanyRouter);
router.use('/refresh', postRefreshCompanyRouter);

export { router as companyRouter };
