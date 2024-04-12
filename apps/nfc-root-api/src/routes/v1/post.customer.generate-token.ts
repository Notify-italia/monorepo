import { EnumNotifyUserType } from '@notify/interfaces';
import { refreshToken, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('id').isMongoId().withMessage('Invalid id'),
  body('type').isString().withMessage('Invalid type'),
  requestHandler(
    async (req, res) => {
      const { id, type } = req.body;

      const { token } = await refreshToken(
        {
          _id: id,
          userType: type,
        },
        type === EnumNotifyUserType.Company ? 'license' : ''
      );

      res.send({
        token,
      });
    },
    {
      requireApiKey: true,
    }
  )
);

export { router as postCustomerGenerateTokenRouter };
