import {
  NOTIFICATION_VALIDATION_MESSAGES,
  NotificationModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('type')
    .optional()
    .matches(/^(unread|all)$/)
    .withMessage('Tipo di notifica non valido'),
  query('id')
    .optional()
    .isMongoId()
    .withMessage(NOTIFICATION_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req, res) => {
      const { type, id } = req.query;

      const user = req.currentUser;

      const notifications = await NotificationModel.find({
        owner: user._id,
        ...(id ? { _id: id } : {}),
        ...(type === 'unread' ? { read: false } : {}),
      })
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();

      if (id) {
        res.status(200).send(notifications[0]);
        return;
      }

      const unread = notifications.filter((n) => !n.read);
      const read = notifications.filter((n) => n.read);

      res.status(200).send([...unread, ...read]);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getNotificationsRouter };
