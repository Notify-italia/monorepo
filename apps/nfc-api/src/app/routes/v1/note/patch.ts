import {
  BadRequestError,
  NOTE_VALIDATION_MESSAGES,
  NoteModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { body, query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.patch(
  '/',
  query('id')
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  body('note').exists().isObject().withMessage('Progetto non valido'),
  requestHandler(
    async (req, res) => {
      const { note } = req.body;
      const { id } = req.query;

      const foundNote = await NoteModel.findOne({
        _id: id,
        owners: { $in: req.currentUser._id },
      });

      if (!foundNote) {
        throw new BadRequestError('Progetto non trovato');
      }

      foundNote.set(note);
      await foundNote.save();

      res.status(201).send(foundNote);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as patchNoteRouter };
