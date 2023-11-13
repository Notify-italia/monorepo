import { Router } from 'express';
import { postAgentRouter } from './post';
import { postRefreshAgentRouter } from './post.refresh';
import { postSigninAgentRouter } from './post.signin';

const router = Router();

router.use('/', postAgentRouter);
router.use('/signin', postSigninAgentRouter);
router.use('/refresh', postRefreshAgentRouter);

export { router as agentRouter };
