import { NotificationModel, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  requestHandler(
    async (req, res) => {
      const { type } = req.query;

      const user = req.currentUser;

      const notifications = await NotificationModel.find({
        owner: user._id,
        read: false,
      });

      res.status(200).send({ result: notifications.length });
    },
    {
      requireAuth: {
        requireLicense: false,
      },
    }
  )
);

export { router as getUnreadNotificationsCountRouter };
