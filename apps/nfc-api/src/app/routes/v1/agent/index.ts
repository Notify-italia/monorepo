import { Router } from 'express';
import { postAgentRouter } from './post';

const router = Router();

router.use('/', postAgentRouter);

export { router as agentRouter };
