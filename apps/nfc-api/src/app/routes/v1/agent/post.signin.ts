import { validateRequest } from 'apps/nfc-api/src/middlewares/middleware.validate-request';
import { AGENT_VALIDATION_MESSAGES } from 'apps/nfc-api/src/models/model.agent';
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
    .withMessage(AGENT_VALIDATION_MESSAGES.email as string),
  body('password')
    .trim()
    .toLowerCase()
    .isLength({ min: 4, max: 20 })
    .withMessage(AGENT_VALIDATION_MESSAGES.password as string),
  validateRequest,
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      res.status(201).send('ok');
    }
  )
);

export { router as postSigninAgentRouter };
