import { Router } from 'express';
import { postCompanyRouter } from './post';
import { postSigninCompanyRouter } from './post.signin';

const router = Router();

router.use('/', postCompanyRouter);
router.use('/signin', postSigninCompanyRouter);

export { router as companyRouter };
