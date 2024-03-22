import { Request, Router } from 'express';
import { requestHandler } from '../../../services/errors/middlewares/bun.request';
import { refreshToken } from '../../../services/users/service.signin';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      res.status(200).send(await refreshToken(req.currentUser, 'license'));
    },
    {
      requireAuth: {
        requireLicense: false,
        ignoreTokenExpiration: true,
      },
    }
  )
);

export { router as postRefreshCompanyRouter };
