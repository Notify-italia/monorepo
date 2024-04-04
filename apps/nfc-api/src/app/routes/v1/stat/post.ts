import { STAT_VALIDATION_MESSAGES, requestHandler } from '@notify/nfc-api-core';

import { StatManager } from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';

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
  requestHandler(async (req, res) => {
    const { type, owner, value } = req.body;

    const stat = await StatManager.increment(type, owner, undefined, value);

    res.status(201).send(stat.value);
  })
);

export { router as postStatRouter };
