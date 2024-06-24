import {
  Lead,
  LeadModel,
  queryUsers,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { Schema } from 'mongoose';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
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
