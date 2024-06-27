import { Router } from 'express';
import { getLeadRouter } from './get';
import { patchLeadRouter } from './patch';
import { postLeadRouter } from './post';

const router = Router();

router.use('/', postLeadRouter);
router.use('/', getLeadRouter);
router.use('/', patchLeadRouter);

export { router as LeadRouter };
