import { S3Delete, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.delete(
  '/',
  query('profile').isMongoId().withMessage('Profillo non valido.'),
  query('item').isMongoId().withMessage('Item non valido.'),
  query('name').isString().withMessage('Nome non valido.'),
  requestHandler(
    async (req, res) => {
      const { profile, item, name } = req.query;

      const url = await S3Delete({
        name: name as string,
        path: `profiles/${profile}/${item}`,
      });

      res.status(200).send({ url });
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as deleteProfileFileRouter };
