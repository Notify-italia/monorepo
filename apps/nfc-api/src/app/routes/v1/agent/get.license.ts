import {
  CompanyModel,
  NotAuthorizedError,
  requestHandler,
} from '@notify/nfc-api-core';
import { Request, Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      const id = req.currentUser.owner;

      const c = await CompanyModel.findOne({ _id: id })
        .select('license')
        .populate('license')
        .lean();

      if (!c || !c.license) {
        throw new NotAuthorizedError();
      }

      res.send(c.license);
    },
    {
      requireAuth: {
        requireLicense: true,
        ignoreTokenExpiration: false,
      },
    }
  )
);

export { router as getLicenseRouter };
