import { Router } from 'express';
import { postLeadRouter } from './post';

const router = Router();

router.use('/', postLeadRouter);

export { router as LeadRouter };
