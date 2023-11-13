import { validateRequest } from 'apps/nfc-api/src/app/middlewares/middleware.validate-request';
import {
  COMPANY_VALIDATION_MESSAGES,
  CompanyModel,
} from 'apps/nfc-api/src/app/models/model.company';
import { BadRequestError } from 'apps/nfc-api/src/app/services/errors/errors';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { userSignInValidation } from 'apps/nfc-api/src/app/services/service.validation';
import { wLog } from 'apps/nfc-api/src/main';
import { Request, Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  ...userSignInValidation(COMPANY_VALIDATION_MESSAGES),
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
