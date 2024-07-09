import { EnumNotificationTypes } from '@notify/interfaces';
import { requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { Types } from 'mongoose';
import { createNotification } from '../../services/service.notifications';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  requestHandler(async (req, res) => {
    await createNotification({
      title: `Miraka sei un clown`,
      owner: new Types.ObjectId('657b7d4aed97ebff602f8ee9'),
      subtitle: `This is a test notification`,
      notificationType: EnumNotificationTypes.Info,
    });

    res.status(201).json({ message: 'Notification created' });
  }, {})
);

export { router as postTestRouter };
