import { EnumNotifyUserType } from '@notify/interfaces';
import { AGENT_VALIDATION_MESSAGES } from 'apps/nfc-api/src/app/models/model.agent';
import {
  PROFILE_VALIDATION_MESSAGES,
  ProfileModel,
} from 'apps/nfc-api/src/app/models/model.profile';
import { BadRequestError } from 'apps/nfc-api/src/app/services/errors/errors';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { getAgentOwnerProfile } from 'apps/nfc-api/src/app/services/service.profile';
import { Request, Response, Router } from 'express';
import { query } from 'express-validator';
import { injectAuth } from '../../../middlewares/middleware.require-auth';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .optional()
    .isMongoId()
    .withMessage(AGENT_VALIDATION_MESSAGES._id as string),
  errorHandledRequest(async (req, res) => {
    //injecting the authorization manually to avoid throwing an error if the user is not logged in
    await injectAuth(req);

    switch (req.currentUser?.userType) {
      case EnumNotifyUserType.Agent:
        return await _agentFlow(req, res);
      case EnumNotifyUserType.Company:
        return await _companyFlow(req, res);
      default:
        return await _profilePlayerFlow(req, res);
    }
  })
);

export { router as getProfileRouter };

const _profilePlayerFlow = async <T>(req: Request<T>, res: Response) => {
  const { id } = req.query;

  const profile = await ProfileModel.findById(id).lean();

  if (!profile) {
    throw new BadRequestError(PROFILE_VALIDATION_MESSAGES._id as string);
  }
  res.status(200).send({
    ...profile,
    __v: undefined,
    company: await getAgentOwnerProfile(profile.owner),
  });
  return;
};

const _agentFlow = async <T>(req: Request<T>, res: Response) => {
  const profile = await ProfileModel.findOne({
    owner: req.currentUser._id,
  }).lean();

  if (!profile) {
    throw new BadRequestError(PROFILE_VALIDATION_MESSAGES._id as string);
  }

  res.status(200).send({
    ...profile,
    __v: undefined,
    company: await getAgentOwnerProfile(profile.owner),
  });

  return;
};

const _companyFlow = async <T>(req: Request<T>, res: Response) => {
  const profile = await ProfileModel.findOne({
    owner: req.currentUser._id,
  }).lean();

  if (!profile) {
    throw new BadRequestError(PROFILE_VALIDATION_MESSAGES._id as string);
  }

  res.status(200).send({
    ...profile,
    __v: undefined,
  });
};
