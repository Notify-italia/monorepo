import { refreshToken, requestHandler } from '@notify/nfc-api-core';
import { Request, Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      res.status(200).send(await refreshToken(req.currentUser));
    },
    {
      requireAuth: {
        requireLicense: true,
        ignoreTokenExpiration: true,
      },
    }
  )
);

export { router as postRefreshAgentRouter };
