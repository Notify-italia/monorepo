import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { query } from 'express-validator';
import {
  NOTE_VALIDATION_MESSAGES,
  NoteModel,
} from '../../../models/model.note';
import { BadRequestError } from '../../../services/errors/errors';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .optional()
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  errorHandledRequest(
    async (req, res) => {
      const { id } = req.query;

      if (id) {
        const note = await NoteModel.findOne({
          _id: id,
          owners: { $in: req.currentUser._id },
        });

        if (!note) {
          new BadRequestError('Note not found');
        }

        res.status(200).send(note);
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
