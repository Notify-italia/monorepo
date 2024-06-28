import {
  EnumNotifyAdvancedProfileItems,
  EnumNotifyUserType,
  INotifyPopulatedProfile,
} from '@notify/interfaces';
import {
  AGENT_VALIDATION_MESSAGES,
  BadRequestError,
  PROFILE_VALIDATION_MESSAGES,
  ProfileModel,
  getAgentOwnerProfile,
  injectAuth,
  isValidObjectId,
  requestHandler,
} from '@notify/nfc-api-core';
import { Request, Response, Router } from 'express';
import { query } from 'express-validator';
import { Types } from 'mongoose';

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

  const profile: INotifyPopulatedProfile | null = await ProfileModel.findOne(
    isValidObjectId(id as string) ? { _id: id } : { profileIdentifier: id }
  )
    .populate('note')
    .lean();

  if (!profile) {
    throw new BadRequestError('Profilo non trovato');
  }

  profile.company = await getAgentOwnerProfile(<Types.ObjectId>profile.owner);

  const toBeTranslated = JSON.parse(
    JSON.stringify({
      company: {
        advancedProfile: {
          items: profile.company?.advancedProfile?.items,
        },
      },
      advancedProfile: {
        items: profile.advancedProfile.items,
      },
    })
  ) as INotifyPopulatedProfile;

  (toBeTranslated.company as any).advancedProfile.items =
    toBeTranslated.company?.advancedProfile?.items
      .filter((v) => v.visible)
      .filter((v) => v.type !== EnumNotifyAdvancedProfileItems.Divider)
      .filter(
        (v) =>
          !(v.type === EnumNotifyAdvancedProfileItems.Photo && !v.title.length)
      )
      .map((v: any) => {
        delete v.textConfig;
        delete v.type;
        delete v.visible;
        delete v.showTitle;
        delete v._id;
        return v;
      });

  toBeTranslated.advancedProfile.items = toBeTranslated.advancedProfile.items
    .filter((v) => v.visible)
    .filter((v) => v.type !== EnumNotifyAdvancedProfileItems.Divider)
    .filter(
      (v) =>
        !(v.type === EnumNotifyAdvancedProfileItems.Photo && !v.title.length)
    )
    .map((v: any) => {
      delete v.textConfig;
      delete v.type;
      delete v.visible;
      delete v.showTitle;
      delete v._id;
      return v;
    });

  res.status(200).send({
    ...profile,
    __v: undefined,
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
