import {
  BadRequestError,
  NOTE_VALIDATION_MESSAGES,
  NoteModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .optional()
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req, res) => {
      const { id } = req.query;

      if (id) {
        const note = await NoteModel.findOne({
          _id: id,
          owners: { $in: req.currentUser._id },
        });

        if (!note) {
          throw new BadRequestError('Nota non trovata');
        }

        res.status(200).send(note);
        return;
      }

      const notes = await NoteModel.find({
        owners: { $in: req.currentUser._id },
      });

      res.status(200).send(notes);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getNoteRouter };
