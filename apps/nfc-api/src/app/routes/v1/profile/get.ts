import { validateRequest } from 'apps/nfc-api/src/middlewares/middleware.validate-request';
import {
  AGENT_VALIDATION_MESSAGES,
  AgentModel,
} from 'apps/nfc-api/src/models/model.agent';
import { CompanyDocument } from 'apps/nfc-api/src/models/model.company';
import { ProfileModel } from 'apps/nfc-api/src/models/model.profile';
import { BadRequestError } from 'apps/nfc-api/src/services/errors/errors';
import { errorHandledRequest } from 'apps/nfc-api/src/services/errors/middlewares/bun.error-handler';
import { Request, Router } from 'express';
import { query } from 'express-validator';
import { Types } from 'mongoose';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .isMongoId()
    .withMessage(AGENT_VALIDATION_MESSAGES._id as string),
  validateRequest,
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
        company: await companyProfile(profile._id),
      });
    }
  )
);

export { router as getProfileRouter };

/**
 * The function `companyProfile` retrieves the profile of a company associated with an agent, given the
 * agent's profile ID.
 * @param profileId - The `profileId` parameter is the unique identifier of a profile. It is used to
 * find an agent in the database whose profile matches the given `profileId`.
 * @returns The function `companyProfile` returns the `profile` property of the `company` object.
 */
const companyProfile = async (profileId: Types.ObjectId) => {
  const agent = await AgentModel.findOne({ profile: profileId })
    .populate({
      path: 'company',
      populate: {
        path: 'profile',
        model: 'Profile',
      },
    })
    .lean();

  if (!agent) {
    return undefined;
  }

  return (agent.company as unknown as CompanyDocument).profile;
};
