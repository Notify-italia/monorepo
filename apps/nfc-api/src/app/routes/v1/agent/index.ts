import { Router } from 'express';
import { deleteAgentRouter } from './delete';
import { getAgentRouter } from './get';
import { getLicenseRouter } from './get.license';
import { importAgentsRouter } from './import';
import { patchAgentRouter } from './patch';
import { postAgentRouter } from './post';
import { postRefreshAgentRouter } from './post.refresh';
import { postSigninAgentRouter } from './post.signin';

const router = Router();

router.use('/', postAgentRouter);
router.use('/', getAgentRouter);
router.use('/', patchAgentRouter);
router.use('/', deleteAgentRouter);
router.use('/import', importAgentsRouter);
router.use('/signin', postSigninAgentRouter);
router.use('/refresh', postRefreshAgentRouter);
router.use('/license', getLicenseRouter);

export { router as agentRouter };
