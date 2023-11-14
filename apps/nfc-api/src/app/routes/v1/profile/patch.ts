import { EnumNotifyUserType, INotifyProfile } from '@notify/nfc-interfaces';
import { generateExpressValidation } from '@notify/utils';
import {
  PROFILE_VALIDATION_MESSAGES,
  ProfileDocument,
  ProfileModel,
} from 'apps/nfc-api/src/app/models/model.profile';
import { BadRequestError } from 'apps/nfc-api/src/app/services/errors/errors';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { getCompanyProfile } from 'apps/nfc-api/src/app/services/service.profile';
import { Request, Router } from 'express';
import { query } from 'express-validator';

const router = Router();

router.patch(
  '/',
  query('id')
    .optional()
    .isMongoId()
    .withMessage(PROFILE_VALIDATION_MESSAGES._id as string),
  ...generateExpressValidation(PROFILE_VALIDATION_MESSAGES, [
    'name',
    'surname',
  ]),
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { id } = req.query;

      const body = req.body;

      if (
        req.currentUser.userType === EnumNotifyUserType.Agent ||
        (req.currentUser.userType === EnumNotifyUserType.Company && !id)
      ) {
        //if the user is an agent or a company and is trying to edit his own profile we get the profile directly form the logged in user
        //this ensures that the user can't edit other profiles
        const profile = (await ProfileModel.findById(
          req.currentUser.profile
        )) as ProfileDocument;

        await _editProfile(profile, body);

        res.status(200).send({
          ...profile.toObject(),
          __v: undefined,
          company: await getCompanyProfile(profile._id),
        });

        return;
      }

      //TODO controlla se il profilo che sta venendo modificato è di proprietà della company
      const profile = (await ProfileModel.findById(id)) as ProfileDocument;

      await _editProfile(profile, body);

      res.status(200).send({
        ...profile.toObject(),
        __v: undefined,
        company: await getCompanyProfile(profile._id),
      });
    },
    { requireAuth: true }
  )
);

export { router as patchProfileRouter };

const _editProfile = async (
  source: ProfileDocument | null,
  toEdit: INotifyProfile
) => {
  if (!source) {
    throw new BadRequestError('Profilo non trovato');
  }

  source.name = toEdit.name || source.name;
  source.surname = toEdit.surname || source.surname;
  source.email = toEdit.email;
  source.phoneNumber = toEdit.phoneNumber;
  source.bio = toEdit.bio;
  source.avatar = toEdit.avatar;
  source.config = toEdit.config;
  source.customFields = toEdit.customFields;

  await source.save();

  return source;
};
