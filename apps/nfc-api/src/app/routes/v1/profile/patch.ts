import { generateExpressValidation } from '@notify/api-shared';
import { EnumNotifyUserType, INotifyProfile } from '@notify/interfaces';
import { Request, Router } from 'express';
import { query } from 'express-validator';
import {
  PROFILE_VALIDATION_MESSAGES,
  ProfileDocument,
  ProfileModel,
} from '../../../models/model.profile';
import { BadRequestError } from '../../../services/errors/errors';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';
import { S3Upload } from '../../../services/service.bucket';
import { getAgentOwnerProfile } from '../../../services/service.profile';

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
        const profile = (await ProfileModel.findOne({
          owner: req.currentUser._id,
        })) as ProfileDocument;

        await _editProfile(profile, body);

        res.status(200).send({
          ...profile.toObject(),
          __v: undefined,
          company: await getAgentOwnerProfile(profile.owner),
        });

        return;
      }

      //TODO controlla se il profilo che sta venendo modificato è di proprietà della company
      const profile = (await ProfileModel.findById(id)) as ProfileDocument;

      await _editProfile(profile, body);

      res.status(200).send({
        ...profile.toObject(),
        __v: undefined,
        company: await getAgentOwnerProfile(profile.owner),
      });
    },
    {
      requireAuth: {
        requireLicense: false,
      },
    }
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

  toEdit._id === undefined;
  toEdit.updatedAt === undefined;
  toEdit.createdAt === undefined;
  toEdit.type === undefined;

  if (toEdit.avatar !== source.avatar && toEdit.avatar?.length) {
    toEdit.avatar = await S3Upload({
      src: toEdit.avatar,
      name: `avatar`,
      path: `profiles/${source._id}`,
    });
  }

  source.set(toEdit);

  await source.save();

  return source;
};
