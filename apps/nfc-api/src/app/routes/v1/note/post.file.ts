import { S3Upload, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('file').exists().withMessage('Nessun file caricato.'),
  body('note').isMongoId().withMessage('Nota non valida.'),
  body('item').isMongoId().withMessage('Item non valido.'),
  body('name').isString().withMessage('Nome non valido.'),
  requestHandler(
    async (req, res) => {
      const { file, note, item, name } = req.body;

      const url = await S3Upload({
        src: file,
        name,
        path: `notes/${note}/${item}`,
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

export { router as postNoteFileRouter };
