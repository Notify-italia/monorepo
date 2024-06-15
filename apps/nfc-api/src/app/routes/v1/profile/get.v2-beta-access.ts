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
  '66687001e8fbfbfbc98b30a8',
  '666870dfe8fbfbfbc98b30c3',
  '66687acee63891070d974ad2',
  '6602f264d430a9dccdd7a682',
  '660850080d1d685e63ecd88f',
  '66084f260d1d685e63ecd722',
  '660850a70d1d685e63ecd915',
  '6668b9f7bcf8c259b44dfdfd',
  '6668ba21bcf8c259b44dfe11',
  '666ae4fc437eba842eec481a',
  '666af00697b4213a94fb2c33',
  '65c2b3edec503b4a3bf7bbda',
  '65e9fa91abf4e1a4cf893ae8',
  '666b4da3030dba50b10a8800',
  '65e9fa91abf4e1a4cf893ae2',
  '65e9fa91abf4e1a4cf893ae5',
  '65e9fa91abf4e1a4cf893ad6',
  '65c2b4d0ec503b4a3bf7bbfc',
  '65e9fa91abf4e1a4cf893aeb',
  '65e9fa91abf4e1a4cf893ad9',
  '65c2b5ccc98d7d2e9471f680',
  '65e9fa91abf4e1a4cf893adc',
  '65c2b56ac98d7d2e9471f637',
  '6602c987d430a9dccdd7a208',
  '65e9fa91abf4e1a4cf893ad3',
  '65e9fa91abf4e1a4cf893ad0',
  '65e9fa91abf4e1a4cf893adf',
  '65c2b582c98d7d2e9471f645',
  '65c2b54ec98d7d2e9471f629',
  '666b4e00030dba50b10a8814',
  '666d53868c87949499644e67',
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
