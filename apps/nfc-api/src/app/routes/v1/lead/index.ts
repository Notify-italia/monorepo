import { Router } from 'express';
import { getLeadRouter } from './get';
import { postLeadRouter } from './post';

const router = Router();

router.use('/', postLeadRouter);
router.use('/', getLeadRouter);

export { router as LeadRouter };
