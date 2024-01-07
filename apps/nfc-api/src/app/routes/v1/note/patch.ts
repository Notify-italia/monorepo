import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  NOTE_VALIDATION_MESSAGES,
  NoteModel,
} from '../../../models/model.note';
import { BadRequestError } from '../../../services/errors/errors';

//boilderplate for a post request to create an agent
const router = Router();

router.patch(
  '/',
  query('id')
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  body('title')
    .optional()
    .isString()
    .withMessage(NOTE_VALIDATION_MESSAGES.title as string),
  body('content')
    .optional()
    .isString()
    .withMessage(NOTE_VALIDATION_MESSAGES.content as string),
  body('color')
    .optional()
    .isString()
    .withMessage(NOTE_VALIDATION_MESSAGES.color as string),
  errorHandledRequest(
    async (req, res) => {
      const { title, content, color } = req.body;
      const { id } = req.query;

      const note = await NoteModel.findOne({
        _id: id,
        owner: req.currentUser._id,
      });

      if (!note) {
        throw new BadRequestError('Nota non trovata');
      }

      note.title = title || note?.title;
      note.content = content || note?.content;
      note.color = color || note?.color;

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

export { router as patchNoteRouter };
