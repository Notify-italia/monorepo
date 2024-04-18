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
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  requestHandler(async (req, res) => {
    const { id } = req.query;

    const note = await NoteModel.findById(id).lean();

    if (!note) {
      throw new BadRequestError('Nota non trovata');
    }

    res.send(note);
  })
);

export { router as getPublicNoteRouter };
