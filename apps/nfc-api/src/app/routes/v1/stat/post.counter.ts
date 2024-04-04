import { EnumNotifyUserType } from '@notify/interfaces';
import { STAT_VALIDATION_MESSAGES } from '@notify/nfc-api-core';
import { requestHandler } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.request';
import { Router } from 'express';
import { body } from 'express-validator';
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
  body('userType')
    .custom((value) => [...Object.values(EnumNotifyUserType)].includes(value))
    .withMessage('userType is required'),

  requestHandler(async (req, res) => {
    const { type, owner, value, userType } = req.body;

    const user = await StatManager.incrementCounter(
      type,
      owner,
      userType,
      value
    );

    res.status(201).send(user);
  })
);

export { router as postStatCounterRouter };
