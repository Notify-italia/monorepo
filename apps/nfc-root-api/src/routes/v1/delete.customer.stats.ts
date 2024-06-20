import { INotifyUserStats } from '@notify/interfaces';
import {
  AgentModel,
  BadRequestError,
  COMPANY_VALIDATION_MESSAGES,
  CompanyModel,
  FeedbackModel,
  StatModel,
  asyncForEach,
  requestHandler,
} from '@notify/nfc-api-core';
import { Request, Router } from 'express';
import { query } from 'express-validator';
//boilderplate for a post request to create an agent
const router = Router();

router.delete(
  '/',
  query('id')
    .isMongoId()
    .withMessage(COMPANY_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { id } = req.query;

      const company = await CompanyModel.findById(id).populate('profile');

      if (!company) {
        throw new BadRequestError('Company not found');
      }

      const agents = await AgentModel.find({ owner: id }).populate('profile');

      console.log(
        `deleting feedbacks`,
        (
          await FeedbackModel.find({
            owner: {
              $in: [company?._id, ...agents.map((i) => i._id).filter((v) => v)],
            },
          })
            .select('_id')
            .lean()
        ).length
      );
      console.log(
        `deleting stats`,
        (
          await StatModel.find({
            owner: {
              $in: [company?._id, ...agents.map((i) => i._id).filter((v) => v)],
            },
          })
            .select('_id')
            .lean()
        ).length
      );

      await asyncForEach(
        [company?._id, ...agents.map((v) => v._id)],
        async (n) => {
          await FeedbackModel.deleteMany({ owner: n });
          await StatModel.deleteMany({ owner: n });
        }
      );

      company.statsTotals = {} as INotifyUserStats;
      await company.save();

      await asyncForEach(agents, async (agent) => {
        agent.statsTotals = {} as INotifyUserStats;
        await agent.save();
      });

      res.status(201).send(company);
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as deleteCustomerStatsRouter };
