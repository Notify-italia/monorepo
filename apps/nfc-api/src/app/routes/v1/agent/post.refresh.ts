import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { refreshToken } from 'apps/nfc-api/src/app/services/users/service.signin';
import { Request, Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      res.status(200).send(await refreshToken(req.currentUser));
    },
    {
      requireAuth: true,
    }
  )
);

export { router as postRefreshAgentRouter };
