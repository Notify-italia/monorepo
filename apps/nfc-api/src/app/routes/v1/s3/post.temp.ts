import { S3Upload, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('data').isString().withMessage('Nessun file caricato.'),
  body('extension').isString().withMessage('Estensione non valida.'),
  requestHandler(
    async (req, res) => {
      let { data, extension } = req.body;

      const url = await S3Upload({
        src: data,
        name: _randomName(),
        extension: extension,
        path: `temp/leads`,
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

export { router as postTempFileRouter };

const _randomName = () => {
  return Math.random().toString(36).substring(2);
};
