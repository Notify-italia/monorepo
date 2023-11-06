import { Router } from 'express';
import { postAgentRouter } from './post';
import { postSigninAgentRouter } from './post.signin';

const router = Router();

router.use('/', postAgentRouter);
router.use('/signin', postSigninAgentRouter);

export { router as agentRouter };
