import {
  EnumNotificationTypes,
  EnumNotifyNotificationActionEvents,
  INotifyLead,
  INotifyUser,
} from '@notify/interfaces';
import {
  asyncForEach,
  BadRequestError,
  getContactName,
  getProfile,
  LeadDocument,
  LeadModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';
import { Types } from 'mongoose';
import { createNotification } from '../../../services/service.notifications';

//boilderplate for a post request to create an agent
const router = Router();

router.patch(
  '/',
  query('id').isMongoId().withMessage('id must be a valid mongo id'),
  requestHandler(
    async (req, res) => {
      const data: INotifyLead = req.body;
      const id = req.query.id as string;

      const lead = await LeadModel.findById(id);

      if (!lead) {
        throw new BadRequestError('Lead non trovato');
      }

      await _sendSharedByChangedNotification(data, lead, req.currentUser);

      await _sendNewCommentNotification(data, lead);

      lead.set(data);

      await lead.save();

      res.send(lead);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as patchLeadRouter };

const _getLeadName = (lead: INotifyLead) => {
  if (lead.name || lead.surname) {
    return `${lead.name} ${lead.surname}`.trim();
  }
  return lead.company || 'contatto';
};

const _sendSharedByChangedNotification = async (
  data: INotifyLead,
  lead: LeadDocument,
  currentUser: INotifyUser
) => {
  if (!data.sharedBy || data.sharedBy.length <= lead.sharedBy.length) {
    return;
  }
  const newUser = data.sharedBy.find(
    (x) => !lead.sharedBy.map((v) => String(v)).includes(x)
  );

  if (!newUser) {
    throw new BadRequestError(
      'Stai cercando di condividere un contatto con un utente non valido'
    );
  }

  const profile = await getProfile(currentUser._id);

  if (!profile) {
    throw new BadRequestError('Non ho trovato il tuo profilo');
  }

  await createNotification(
    {
      owner: new Types.ObjectId(newUser),
      notificationType: EnumNotificationTypes.Info,
      title: `${getContactName(profile)} ti ha condiviso un contatto!`,
      subtitle: `
          '${_getLeadName(
            lead.toObject()
          )}' è ora disponibile nella tua lista contatti.`,
      actions: [
        {
          id: new Types.ObjectId().toHexString(),
          eventName: EnumNotifyNotificationActionEvents.LeadsRouteDetail,
          title: 'Apri',
          data: { id: lead._id },
        },
        {
          id: new Types.ObjectId().toHexString(),
          eventName: EnumNotifyNotificationActionEvents.NotificationEventIgnore,
          title: 'Ok',
          data: {},
        },
      ],
    },
    'Visualizza su Notify'
  );
};

const _sendNewCommentNotification = async (
  data: INotifyLead,
  lead: LeadDocument
) => {
  if (!data.comments || data.comments.length <= lead.comments.length) {
    return;
  }

  const newComment = data.comments[data.comments.length - 1];

  if (!newComment) {
    throw new BadRequestError(
      'Stai cercando di aggiungere un commento non valido'
    );
  }

  const submitter = await getProfile(newComment.createdBy);

  if (!submitter) {
    throw new BadRequestError('Non ho trovato il tuo profilo');
  }

  const submitterName = getContactName(submitter);

  const usersToBeNotified = lead.sharedBy.filter(
    (x) => String(x) !== String(newComment.createdBy)
  );

  await asyncForEach(usersToBeNotified, async (userId) => {
    await createNotification(
      {
        owner: userId as unknown as Types.ObjectId,
        notificationType: EnumNotificationTypes.Info,
        title: `[${_getLeadName(lead.toObject())}] ${submitterName} ha scritto`,
        subtitle: newComment.content,
        actions: [
          {
            id: new Types.ObjectId().toHexString(),
            eventName: EnumNotifyNotificationActionEvents.LeadsRouteDetail,
            title: 'Apri',
            data: { id: lead._id },
          },
          {
            id: new Types.ObjectId().toHexString(),
            eventName:
              EnumNotifyNotificationActionEvents.NotificationEventIgnore,
            title: 'Ok',
            data: {},
          },
        ],
      },
      newComment.content
    );
  });
};
