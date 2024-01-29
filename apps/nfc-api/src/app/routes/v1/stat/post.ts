import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { body } from 'express-validator';
import { STAT_VALIDATION_MESSAGES } from '../../../models/model.stat';
import { StatManager } from '../../../services/service.stat';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('type')
    .isString()
    .withMessage(STAT_VALIDATION_MESSAGES.type as string),
  body('owner')
    .isMongoId()
    .withMessage(STAT_VALIDATION_MESSAGES.owner as string),
  body('value')
    .optional()
    .isNumeric()
    .withMessage(STAT_VALIDATION_MESSAGES.value as string),
  errorHandledRequest(async (req, res) => {
    const { type, owner, value } = req.body;

    const stat = await StatManager.increment(type, owner, undefined, value);

    res.status(201).send(stat.value);
  })
);

export { router as postStatRouter };
