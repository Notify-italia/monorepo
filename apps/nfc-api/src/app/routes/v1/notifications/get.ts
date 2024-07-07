import { NotificationModel, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('type')
    .matches(/^(unread|all)$/)
    .withMessage('Tipo di notifica non valido'),
  requestHandler(
    async (req, res) => {
      const { type } = req.query;

      const user = req.currentUser;

      const notifications = await NotificationModel.find({
        owner: user._id,
        ...(type === 'unread' ? { read: false } : {}),
      })
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();

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
