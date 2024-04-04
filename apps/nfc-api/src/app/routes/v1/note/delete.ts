import {
  NOTE_VALIDATION_MESSAGES,
  NoteModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.delete(
  '/',
  query('id')
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  requestHandler(
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
