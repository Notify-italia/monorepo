import { generateExpressValidation } from '@notify/utils';
import { validateRequest } from 'apps/nfc-api/src/app/middlewares/middleware.validate-request';
import {
  PROFILE_VALIDATION_MESSAGES,
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
  validateRequest,
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { id } = req.query;

      const body = req.body;

      if (!id) {
        //TODO modifica sempre il profilo dell'utente loggato se il profilo è agente o è company e sta modificando il profilo azeindale
        res.status(200).send({
          ...body,
          __v: undefined,
          company: await getCompanyProfile(body._id),
        });
        return;
      }

      //TODO controlla se il profilo che sta venendo modificato è di proprietà della company
      const profile = await ProfileModel.findById(id);

      if (!profile) {
        throw new BadRequestError('Profilo non trovato');
      }

      profile.name = body.name || profile.name;
      profile.surname = body.surname || profile.surname;
      profile.email = body.email;
      profile.phoneNumber = body.phoneNumber;
      profile.bio = body.bio;
      profile.avatar = body.avatar;
      profile.config = body.config;
      profile.customFields = body.customFields;

      await profile.save();

      res.status(200).send({
        ...profile.toObject(),
        __v: undefined,
        company: await getCompanyProfile(profile._id),
      });
    }
  )
);

export { router as patchProfileRouter };
