import { requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { SocketEmitNewNotification } from '../../socketio/events-emitters/socket.emit.new-notification';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  requestHandler(async (req, res) => {
    SocketEmitNewNotification('657b7d4aed97ebff602f8ee9');
    res.send('Hello World');
  }, {})
);

export { router as postTestRouter };
