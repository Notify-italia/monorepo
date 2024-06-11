import { requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

const ADVANCED_PROFILE_BETA: string[] = [
  '657f8988e0500872e4275d83',
  '657f7376e0500872e4275d4c',
  '657f565d539981b49a39d5a2',
  '657b7d4aed97ebff602f8eea',
  '657f61da3e18748bb264a57e',
  '655805c8f5638dc5ef4b3590',
  '665d8209437686950a929389',
  '665d7996437686950a9290e9',
  '65c23f35c92682d98233e510',
  '65eedfa9ac3a0d7b566667de',
  '65c61ae310639665d6dbc595',
  '65ca137c4f774a6d762049eb',
  '65c534151d596e3d57b026c7',
  '666824fe3d23e2840f0f53f1',
  '66683fd5391624cd83d619bf',
];

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('profile').optional().isMongoId(),
  requestHandler(
    async (req, res) => {
      const { profile } = req.query;

      res.send({
        hasAccess: ADVANCED_PROFILE_BETA.includes(profile as string),
      });
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getV2BetaAccessRouter };
