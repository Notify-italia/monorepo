import { Router } from 'express';
import { getAgentRouter } from './get';
import { patchAgentRouter } from './patch';
import { postAgentRouter } from './post';
import { postRefreshAgentRouter } from './post.refresh';
import { postSigninAgentRouter } from './post.signin';

const router = Router();

router.use('/', postAgentRouter);
router.use('/', getAgentRouter);
router.use('/', patchAgentRouter);
router.use('/signin', postSigninAgentRouter);
router.use('/refresh', postRefreshAgentRouter);

export { router as agentRouter };
