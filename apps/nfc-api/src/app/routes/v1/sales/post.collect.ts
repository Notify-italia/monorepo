import {
  EnumNotificationTypes,
  EnumNotifyNotificationActionEvents,
} from '@notify/interfaces';
import { LeadModel, queryUsers, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';
import mongoose, { Schema } from 'mongoose';
import { createNotification } from '../../../services/service.notifications';

//boilderplate for a post request to create an agent
const router = Router();

const notifyCompanyId = '655805c8f5638dc5ef4b358f';

router.post(
  '/',
  body('name'),
  body('email'),
  body('phone'),
  body('role'),
  requestHandler(async (req, res) => {
    const body = JSON.parse(
      Buffer.from(req.body.d, 'base64').toString('utf-8')
    );

    if (!body.name || (!body.email && !body.phone)) {
      res.send({ status: 'error' });
      return;
    }

    const user = await queryUsers({ _id: notifyCompanyId }, true, 'profile');

    const [name, surname] = body.name.split(' ');

    const foundLead = await LeadModel.findOne({
      emails: [body.email],
      phoneNumbers: [body.phone],
      name: name,
      surname: surname,
    });

    if (foundLead) {
      res.status(200).send({ status: 'collected' });
      return;
    }

    const lead = LeadModel.build({
      name: name,
      surname: surname || '',
      emails: [body.email],
      phoneNumbers: [body.phone],
      role: body.role,
      createdBy: user._id as unknown as Schema.Types.ObjectId,
      sharedBy: [user._id as unknown as Schema.Types.ObjectId],
      acceptanceMessage: 'Ottenuto tramite sito web Notify',
    });

    await createNotification(
      {
        title: 'Nuovo lead dal sito web',
        owner: user._id,
        notificationType: EnumNotificationTypes.ActionRequired,
        subtitle: `
      <style>
       ul {
            list-style-type: none;
            padding-left: 0;
          }
          li {
            margin-bottom: 5px;
          }
      </style>
      <div class="flex flex-col justify-start text-start space-y-3">
      <span>
      Qualcuno ha compilato il form sul sito web con le seguenti informazioni:
      </span>
        <ul class="text-start justify-start">
          <li>
          <span class="font-bold">
          Nome:
          </span>
           ${lead.name || ''}</li>
          <li>
          <span class="font-bold">
          Cognome:
          </span>
           ${lead.surname || ''}</li>
          <li>
          <span class="font-bold">
          Email:
          </span>
           ${lead.emails.join(', ') || ''}</li>
          <li>
          <span class="font-bold">
          N.Telefono:
          </span>
           ${lead.phoneNumbers.join(', ') || ''}</li>
          </ul>
      </div>`,
        actions: [
          {
            id: new mongoose.Types.ObjectId().toString(),
            title: 'Approva',
            data: {
              leadId: lead._id,
            },
            eventName: EnumNotifyNotificationActionEvents.ContactFormLeadAccept,
          },
          {
            id: new mongoose.Types.ObjectId().toString(),
            title: 'Rifiuta',
            data: {
              leadId: lead._id,
            },
            eventName: EnumNotifyNotificationActionEvents.ContactFormLeadReject,
          },
        ],
      },
      'Visualizza su Notify'
    );

    res.status(200).send({ status: 'collected' });

    await lead.save();
  })
);

export { router as postSalesCollectRouter };
