import { AgentModel, CompanyModel, requestHandler } from '@notify/nfc-api-core';
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

      const companies = await CompanyModel.find({
        license: { $ne: null },
      })
        .skip((page - 1) * items)
        .limit(items)
        .populate('license profile')
        .lean();

      console.log(`found ${companies.length} companies`);

      const companyUsers = await AgentModel.find({
        owner: { $in: companies.map((company) => company._id) },
      })
        .populate('profile')
        .lean();

      console.log(`found ${companyUsers.length} users`);

      res.send(
        companies.map((company) => {
          return {
            ...company,
            users: companyUsers.filter(
              (user) => String(user.owner) === String(company._id)
            ),
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

export { router as getCustomersRouter };
