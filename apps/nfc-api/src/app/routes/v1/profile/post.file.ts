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
  upload.fields([{ name: 'file' }, { name: 'profile' }, { name: 'item' }]),
  body('file').optional().exists().withMessage('Nessun file caricato.'),
  body('profile').isMongoId().withMessage('Profilo non valido.'),
  body('item').isString().withMessage('Item non valido.'),
  body('name').optional().isString().withMessage('Nome non valido.'),
  requestHandler(
    async (req, res) => {
      let { file, profile, item, name } = req.body;

      const url = await S3Upload({
        src: file.blob,
        name: name || file.name,
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

export { router as postProfileFileRouter };

const _fileToBase64 = (file: Express.Multer.File) => {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};
