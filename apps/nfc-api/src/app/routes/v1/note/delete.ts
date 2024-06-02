import {
  INotifyNote,
  INotifyNoteItemFiles,
  INotifyNoteItemPhoto,
} from '@notify/interfaces';
import {
  BadRequestError,
  NOTE_VALIDATION_MESSAGES,
  NoteModel,
  S3Delete,
  asyncForEach,
  getFilenameFromUrl,
  getPathFromUrl,
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

      const note = await NoteModel.findOne({
        _id: id,
        owners: { $in: req.currentUser._id },
      }).lean();

      if (!note) {
        throw new BadRequestError('Progetto non trovata');
      }

      await NoteModel.deleteOne({
        _id: id,
        owners: { $in: req.currentUser._id },
      });

      await asyncForEach(
        _noteCdnUrls(note as unknown as INotifyNote),
        async (file) => {
          await S3Delete({
            path: getPathFromUrl(file),
            name: getFilenameFromUrl(file),
          });
        }
      );

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

const _noteCdnUrls = (note: INotifyNote) => {
  const files = note.items
    .filter((item) => ['files'].includes(item.type))
    .map((item) =>
      ((item.value as INotifyNoteItemFiles)?.files || [])
        .map((file) => file.url)
        .flat()
    )
    .flat();

  const photos = note.items
    .filter((item) => item.type === 'photo')
    .map((item) => (item.value as INotifyNoteItemPhoto)?.url);

  return [...files, ...photos].filter((file) => file);
};
