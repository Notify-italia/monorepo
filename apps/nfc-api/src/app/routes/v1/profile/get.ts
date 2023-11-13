import { AGENT_VALIDATION_MESSAGES } from 'apps/nfc-api/src/app/models/model.agent';
import { ProfileModel } from 'apps/nfc-api/src/app/models/model.profile';
import { BadRequestError } from 'apps/nfc-api/src/app/services/errors/errors';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { getCompanyProfile } from 'apps/nfc-api/src/app/services/service.profile';
import { Request, Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .isMongoId()
    .withMessage(AGENT_VALIDATION_MESSAGES._id as string),
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { id } = req.query;

      const profile = await ProfileModel.findById(id).lean();

      if (!profile) {
        throw new BadRequestError('Profilo non trovato');
      }

      res.status(200).send({
        ...profile,
        __v: undefined,
        company: await getCompanyProfile(profile._id),
      });
    }
  )
);

export { router as getProfileRouter };
