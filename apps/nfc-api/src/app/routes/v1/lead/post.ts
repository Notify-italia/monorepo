import { EnumNotifyLeadOrigins } from '@notify/interfaces';
import {
  LEAD_VALIDATION_MESSAGES,
  Lead,
  LeadModel,
  queryUsers,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';
import { Schema } from 'mongoose';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('createdBy')
    .isMongoId()
    .withMessage(LEAD_VALIDATION_MESSAGES.createdBy as string),
  body('name')
    .isString()
    .withMessage(LEAD_VALIDATION_MESSAGES.name as string),
  body('surname')
    .isString()
    .withMessage(LEAD_VALIDATION_MESSAGES.surname as string),
  body('company')
    .isString()
    .withMessage(LEAD_VALIDATION_MESSAGES.company as string),
  body('phoneNumbers')
    .isArray()
    .withMessage(LEAD_VALIDATION_MESSAGES.phoneNumbers as string),
  body('emails')
    .isArray()
    .withMessage(LEAD_VALIDATION_MESSAGES.emails as string),
  body('origin')
    .isIn(Object.values(EnumNotifyLeadOrigins))
    .withMessage(LEAD_VALIDATION_MESSAGES.origin as string),
  requestHandler(async (req, res) => {
    const data: Lead = req.body;

    const user = await queryUsers({ _id: data.createdBy }, true);

    const lead = LeadModel.build({
      ...data,
      sharedBy: [
        data.createdBy,
        user.owner as unknown as Schema.Types.ObjectId,
      ],
    });

    await lead.save();

    res.send(lead);
  })
);

export { router as postLeadRouter };
