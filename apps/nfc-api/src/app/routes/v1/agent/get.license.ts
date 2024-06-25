import {
  AgentModel,
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
      const id = req.currentUser.owner || req.currentUser._id;

      const c = await CompanyModel.findOne({ _id: id })
        .select('license')
        .populate('license')
        .lean();

      if (!c || !c.license) {
        throw new NotAuthorizedError();
      }

      const agents = await AgentModel.find({ owner: id }).lean().select('_id');

      res.send({ ...c.license, agents: agents.length });
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
