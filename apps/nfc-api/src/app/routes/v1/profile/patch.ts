import {
  EnumNotifyUserType,
  INotifyAgent,
  INotifyProfile,
} from '@notify/interfaces';
import {
  BadRequestError,
  PROFILE_VALIDATION_MESSAGES,
  ProfileDocument,
  ProfileModel,
  S3Upload,
  getAgentOwnerProfile,
  populateProfileNote,
  requestHandler,
} from '@notify/nfc-api-core';
import { Request, Router } from 'express';
import { body, query } from 'express-validator';

const router = Router();

router.patch(
  '/',
  query('id')
    .optional()
    .isMongoId()
    .withMessage(PROFILE_VALIDATION_MESSAGES._id as string),
  body('profileIdentifier').optional().toLowerCase(),
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { id } = req.query;

      const body = req.body;

      if (req.currentUser.userType === EnumNotifyUserType.Agent || !id) {
        //if the user is an agent or a company and is trying to edit his own profile we get the profile directly form the logged in user
        //this ensures that users can only edit their own profile (agents) or the profile of their company (companies
        const profile = (await ProfileModel.findOne({
          owner: req.currentUser._id,
        })) as ProfileDocument;

        await _editProfile(profile, body);

        res.status(200).send({
          ...(await populateProfileNote(profile)),
          __v: undefined,
          company: await getAgentOwnerProfile(profile.owner),
        });

        return;
      }

      if (!id) {
        throw new BadRequestError('id non trovato');
      }

      const profile = (await ProfileModel.findById(id).populate({
        path: 'owner',
        model: 'Agent',
        select: 'owner',
        foreignField: '_id',
      })) as ProfileDocument;

      if (
        profile.type === EnumNotifyUserType.Agent &&
        (profile.owner as unknown as INotifyAgent)?.owner?.toString() !==
          req.currentUser._id.toString()
      ) {
        throw new BadRequestError(
          'Non hai i permessi per modificare questo profilo'
        );
      }

      //TODO impedisci di modificare il profilo di un'azienda diversa da se stessi

      await _editProfile(profile, body);

      res.status(200).send({
        ...(await populateProfileNote(profile)),
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

/**
 * The function _editProfile updates a profile document with the provided changes, including uploading
 * a new avatar image to an S3 bucket if necessary.
 * @param {ProfileDocument | null} source - The `source` parameter in the `_editProfile` function is
 * expected to be a `ProfileDocument` object or `null`. It is used to represent the existing profile
 * that is being edited. If `source` is `null`, a `BadRequestError` with the message 'Profilo non
 * @param {INotifyProfile} toEdit - The `toEdit` parameter in the `_editProfile` function is of type
 * `INotifyProfile`. It seems like this parameter is used to update a user's profile information. The
 * function checks if the `source` profile exists, then it modifies the `toEdit` object by removing
 * certain properties
 * @returns The function `_editProfile` is returning the `source` object after it has been updated and
 * saved.
 */
const _editProfile = async (
  source: ProfileDocument | null,
  toEdit: INotifyProfile
) => {
  if (!source) {
    throw new BadRequestError('Profilo non trovato');
  }

  //Removes the _id property from the toEdit object and assign the _id property from the source object
  toEdit = {
    ...toEdit,
    _id: source._id.toString(),
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };

  if (toEdit.avatar !== source.avatar && toEdit.avatar?.length) {
    //If the avatar property in the toEdit object is different from the avatar property in the source object and the avatar property in the toEdit object is not empty
    //then we'll upload the new avatar to the S3 bucket and assign the resulting URL to the avatar property in the toEdit object
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
