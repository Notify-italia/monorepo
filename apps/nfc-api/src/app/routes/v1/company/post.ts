import { Request, Router } from 'express';
import { wLog } from '../../../../main';
import {
  COMPANY_VALIDATION_MESSAGES,
  CompanyModel,
} from '../../../models/model.company';
import { BadRequestError } from '../../../services/errors/errors';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';
import { userSignInValidation } from '../../../services/service.validation';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  ...userSignInValidation(COMPANY_VALIDATION_MESSAGES),
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
