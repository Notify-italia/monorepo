import { INotifyNotification } from '@notify/interfaces';
import {
  BadRequestError,
  NOTIFICATION_VALIDATION_MESSAGES,
  NotificationModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { body, query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.patch(
  '/',
  query('id')
    .isMongoId()
    .withMessage(NOTIFICATION_VALIDATION_MESSAGES._id as string),
  body('notification')
    .isObject()
    .withMessage(NOTIFICATION_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req, res) => {
      const toBeUpdated: Partial<INotifyNotification> = req.body.notification;
      const { id } = req.query;

      const notification = await NotificationModel.findOne({
        _id: id,
        owner: req.currentUser._id,
      });

      if (!notification) {
        throw new BadRequestError(NOTIFICATION_VALIDATION_MESSAGES._id || '');
      }

      notification.set(toBeUpdated);
      await notification.save();

      res.status(200).send(notification);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as patchNotificationsRouter };
