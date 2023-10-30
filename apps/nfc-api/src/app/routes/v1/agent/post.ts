import { validateRequest } from 'apps/nfc-api/src/middlewares/middleware.validate-request';
import {
  AGENT_VALIDATION_MESSAGES,
  AgentModel,
} from 'apps/nfc-api/src/models/model.agent';
import { BadRequestError } from 'apps/nfc-api/src/services/errors/errors';
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
  async (req: Request<{ email: string; password: string }>, res) => {
    const { email, password } = req.body;

    const agent = await AgentModel.build({ email, password }).catch((err) => {
      throw new BadRequestError('Email in uso');
    });

    await agent?.save();

    //todo invia email di conferma

    res.status(201).send(agent);
  }
);

export { router as postAgentRouter };
