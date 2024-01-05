import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { body } from 'express-validator';
import { SchemaTypes } from 'mongoose';
import {
  NOTE_VALIDATION_MESSAGES,
  NoteModel,
} from '../../../models/model.note';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('title')
    .isString()
    .withMessage(NOTE_VALIDATION_MESSAGES.title as string),
  body('content')
    .isString()
    .withMessage(NOTE_VALIDATION_MESSAGES.content as string),
  errorHandledRequest(
    async (req, res) => {
      const { title, content } = req.body;

      const note = await NoteModel.build({
        title,
        content,
        owner: new SchemaTypes.ObjectId(req.currentUser._id),
      });

      await note.save();

      res.status(201).send(note);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as postNoteRouter };
