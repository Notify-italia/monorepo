import { EnumNotificationTypes, INotifyUser } from '@notify/interfaces';
import {
  BadRequestError,
  getContactName,
  getProfileFromUserId,
  Note,
  NOTE_VALIDATION_MESSAGES,
  NoteDocument,
  NoteModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { body, query } from 'express-validator';
import { Types } from 'mongoose';
import { createNotification } from '../../../services/service.notifications';

//boilderplate for a post request to create an agent
const router = Router();

router.patch(
  '/',
  query('id')
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  body('note').exists().isObject().withMessage('Progetto non valido'),
  requestHandler(
    async (req, res) => {
      const { note } = req.body;
      const { id } = req.query;

      const foundNote = await NoteModel.findOne({
        _id: id,
        owners: { $in: req.currentUser._id },
      });

      if (!foundNote) {
        throw new BadRequestError('Progetto non trovato');
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

const _newEditorNotification = async (
  noteDoc: NoteDocument,
  toUpdate: Note,
  currentUser: INotifyUser
) => {
  if (noteDoc.owners.toString() === toUpdate.owners.toString()) {
    return;
  }

  const newEditors = toUpdate.owners.filter(
    (owner) => !noteDoc.owners.includes(owner)
  );

  if (!newEditors.length) {
    return;
  }

  const profile = await getProfileFromUserId(currentUser._id);

  if (!profile) {
    return;
  }

  const userName = getContactName(profile);

  newEditors.forEach(async (editor) => {
    await createNotification({
      title: `${toUpdate.title}`,
      description: `${userName} ti ha aggiunto come editor`,
      notificationType: EnumNotificationTypes.Info,
      owner: editor as unknown as Types.ObjectId,
    });
  });
};
