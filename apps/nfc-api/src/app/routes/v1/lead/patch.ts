import { INotifyLead } from '@notify/interfaces';
import {
  BadRequestError,
  LeadModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.patch(
  '/',
  query('id').isMongoId().withMessage('id must be a valid mongo id'),
  requestHandler(async (req, res) => {
    const data: INotifyLead = req.body;
    const id = req.query.id as string;

    const lead = await LeadModel.findById(id);

    if (!lead) {
      throw new BadRequestError('Lead non trovato');
    }

    lead.set(data);

    await lead.save();

    res.send(lead);
  })
);

export { router as patchLeadRouter };
