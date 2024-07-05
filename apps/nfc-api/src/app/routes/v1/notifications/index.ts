import express from 'express';
import { getNotificationsRouter } from './get';
import { getUnreadNotificationsCountRouter } from './get.unread-count';

const router = express.Router();

router.use('/', getNotificationsRouter);
router.use('/count/unread', getUnreadNotificationsCountRouter);

export { router as notificationsRouter };
