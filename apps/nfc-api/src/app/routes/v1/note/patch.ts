import { NOTE_VALIDATION_MESSAGES, NoteModel } from '@notify/nfc-api-core';
import { requestHandler } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.request';
import { Router } from 'express';
import { body, query } from 'express-validator';
import { BadRequestError } from '../../../services/errors/errors';

//boilderplate for a post request to create an agent
const router = Router();

router.patch(
  '/',
  query('id')
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  body('note').exists().isObject().withMessage('Nota non valida'),
  requestHandler(
    async (req, res) => {
      const { note } = req.body;
      const { id } = req.query;

      const foundNote = await NoteModel.findOne({
        _id: id,
        owners: { $in: req.currentUser._id },
      });

      if (!foundNote) {
        throw new BadRequestError('Nota non trovata');
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
