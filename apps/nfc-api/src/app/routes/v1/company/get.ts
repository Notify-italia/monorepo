import {
  COMPANY_VALIDATION_MESSAGES,
  CompanyModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Request, Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .isMongoId()
    .withMessage(COMPANY_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { id } = req.query;

      const company = await CompanyModel.findById(id)
        .populate('profile')
        .lean();

      res.status(201).send(company);
    }
  )
);

export { router as getCompanyRouter };
