import { NoteModel } from '@notify/nfc-api-core';
import { requestHandler } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.request';
import { Router } from 'express';
import { Schema, Types } from 'mongoose';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  requestHandler(
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
