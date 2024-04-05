import { CompanyModel, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('page').isNumeric().withMessage('Page must be a number'),
  query('items').isNumeric().withMessage('Limit must be a number'),
  requestHandler(
    async (req, res) => {
      const page = req.query.page as unknown as number;
      const items = req.query.items as unknown as number;

      console.log(`page: ${page}, items: ${items}`);

      const companies = await CompanyModel.find()
        .skip((page - 1) * items)
        .limit(items)
        .populate('license profile')
        .lean();

      res.send(companies);
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as getCustomersRouter };
