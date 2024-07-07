import express from 'express';
import { getNotificationsRouter } from './get';
import { getUnreadNotificationsCountRouter } from './get.unread-count';
import { patchNotificationsRouter } from './patch';

const router = express.Router();

router.use('/', getNotificationsRouter);
router.use('/', patchNotificationsRouter);
router.use('/count/unread', getUnreadNotificationsCountRouter);

export { router as notificationsRouter };
