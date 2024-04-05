import {
  AgentModel,
  COMPANY_VALIDATION_MESSAGES,
  CompanyModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .isMongoId()
    .withMessage(COMPANY_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req, res) => {
      const { id } = req.query;

      const company = await CompanyModel.findOne({
        _id: id,
      })

        .populate('license profile')
        .lean();

      const companyUsers = await AgentModel.find({
        owner: id,
      })
        .populate('profile')
        .lean();

      console.log(`found ${companyUsers.length} users`);

      res.send({ ...company, users: companyUsers });
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as getCustomerRouter };
