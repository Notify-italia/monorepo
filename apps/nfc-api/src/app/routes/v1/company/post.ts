import { wLog } from 'apps/nfc-api/src/main';
import { validateRequest } from 'apps/nfc-api/src/middlewares/middleware.validate-request';
import {
  COMPANY_VALIDATION_MESSAGES,
  CompanyModel,
} from 'apps/nfc-api/src/models/model.company';
import { BadRequestError } from 'apps/nfc-api/src/services/errors/errors';
import { errorHandledRequest } from 'apps/nfc-api/src/services/errors/middlewares/bun.error-handler';
import { Request, Router } from 'express';
import { body } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage(COMPANY_VALIDATION_MESSAGES.email as string),
  body('password')
    .trim()
    .toLowerCase()
    .isLength({ min: 4, max: 20 })
    .withMessage(COMPANY_VALIDATION_MESSAGES.password as string),
  validateRequest,
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { email, password } = req.body;

      const company = await CompanyModel.build({ email, password }).catch(
        (err) => {
          wLog(err, 'error');
          throw new BadRequestError('Email già in uso');
        }
      );

      await company?.save();

      //TODO invia email di conferma

      res.status(201).send(company);
    }
  )
);

export { router as postCompanyRouter };
