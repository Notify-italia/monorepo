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
        const faFile = (
          req.files as {
            [fieldname: string]: Express.Multer.File[];
          }
        ).file[0];

        file = _fileToBase64(faFile);

        if (!name) {
          name = faFile.originalname;
        }
      }

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

const _fileToBase64 = (file: Express.Multer.File) => {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};
