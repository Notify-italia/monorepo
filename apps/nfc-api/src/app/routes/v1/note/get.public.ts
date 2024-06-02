import { EnumNotifyUserType } from '@notify/interfaces';
import {
  Agent,
  BadRequestError,
  Company,
  NOTE_VALIDATION_MESSAGES,
  NoteModel,
  genericUserQuery,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  requestHandler(async (req, res) => {
    const { id } = req.query;

    const note = await NoteModel.findById(id).lean();

    if (!note) {
      throw new BadRequestError('Progetto non trovato');
    }

    const agents = await genericUserQuery<false, Agent>(
      EnumNotifyUserType.Agent,
      {
        _id: { $in: note.owners },
      },
      false,
      'profile'
    );

    const company = await genericUserQuery<true, Company>(
      EnumNotifyUserType.Company,
      {
        _id: { $in: note.owners },
      },
      true,
      'profile'
    );

    note.owners = [...agents, company];

    res.send(note);
  })
);

export { router as getPublicNoteRouter };
