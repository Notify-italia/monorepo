import { EnumNotifyUserType } from '@notify/interfaces';
import {
  AGENT_VALIDATION_MESSAGES,
  BadRequestError,
  LicenseManager,
  PROFILE_VALIDATION_MESSAGES,
  ProfileModel,
  getAgentOwnerProfile,
  injectAuth,
  isValidObjectId,
  requestHandler,
} from '@notify/nfc-api-core';
import { Request, Response, Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .optional()
    .exists()
    .toLowerCase()
    .withMessage(AGENT_VALIDATION_MESSAGES._id as string),
  requestHandler(async (req, res) => {
    if (req.query.id) {
      return await _profilePlayerFlow(req, res);
    }

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

  const profile = await ProfileModel.findOne(
    isValidObjectId(id as string) ? { _id: id } : { profileIdentifier: id }
  )
    .populate('note')
    .lean();

  if (!profile) {
    throw new BadRequestError('Profilo non trovato');
  }

  const license = await LicenseManager.load(
    profile.type === EnumNotifyUserType.Agent
      ? {
          agent: String(profile.owner),
        }
      : {
          company: String(profile.owner),
        }
  );

  if (!license || !license.isActive) {
    throw new BadRequestError('Profilo non trovato');
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
  })
    .populate('note')
    .lean();

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
  })
    .populate('note')
    .lean();

  if (!profile) {
    throw new BadRequestError(PROFILE_VALIDATION_MESSAGES._id as string);
  }

  res.status(200).send({
    ...profile,
    __v: undefined,
  });
};
