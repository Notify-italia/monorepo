import {
  CompanyModel,
  LicenseModel,
  requestHandler,
} from '@notify/nfc-api-core';
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

      const licenses = await LicenseModel.find({})
        .skip((page - 1) * items)
        .limit(items)
        .lean();

      const companies = await CompanyModel.find({
        license: { $in: licenses.map((license) => license._id) },
      })
        .populate('profile')
        .lean();

      res.send(
        licenses.map((license) => {
          const company = companies.find(
            (company) => company.license.toString() === license._id.toString()
          );
          return {
            ...license,
            company,
          };
        })
      );
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as getLicensesRouter };
