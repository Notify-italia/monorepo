import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { Schema, Types } from 'mongoose';
import { NoteModel } from '../../../models/model.note';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  errorHandledRequest(
    async (req, res) => {
      const note = await NoteModel.build({
        owners: [
          new Types.ObjectId(
            req.currentUser._id
          ) as unknown as Schema.Types.ObjectId,
        ],
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
