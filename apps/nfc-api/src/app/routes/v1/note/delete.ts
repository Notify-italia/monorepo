import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { query } from 'express-validator';
import {
  NOTE_VALIDATION_MESSAGES,
  NoteModel,
} from '../../../models/model.note';

//boilderplate for a post request to create an agent
const router = Router();

router.delete(
  '/',
  query('id')
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  errorHandledRequest(
    async (req, res) => {
      const { id } = req.query;

      await NoteModel.deleteOne({
        _id: id,
        owners: { $in: req.currentUser._id },
      });

      res.status(201).send({ success: true });
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as deleteNoteRouter };
