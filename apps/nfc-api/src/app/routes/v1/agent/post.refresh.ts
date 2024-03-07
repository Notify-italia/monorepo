import { Request, Router } from 'express';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';
import { refreshToken } from '../../../services/users/service.signin';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      res.status(200).send(await refreshToken(req.currentUser));
    },
    {
      requireAuth: {
        requireLicense: false,
        ignoreExpiration: true,
      },
    }
  )
);

export { router as postRefreshAgentRouter };
