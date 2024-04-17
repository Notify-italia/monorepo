import { S3Upload, requestHandler } from '@notify/nfc-api-core';
import express, { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';

//boilderplate for a post request to create an agent
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  express.urlencoded({ extended: false }),
  upload.fields([{ name: 'file' }, { name: 'note' }, { name: 'item' }]),
  body('file').optional().exists().withMessage('Nessun file caricato.'),
  body('note').isMongoId().withMessage('Nota non valida.'),
  body('item').isMongoId().withMessage('Item non valido.'),
  body('name').optional().isString().withMessage('Nome non valido.'),
  requestHandler(
    async (req, res) => {
      let { file, note, item, name } = req.body;

      if (!file) {
        file = req.file;
      }

      console.log(file, note, item, name);

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
