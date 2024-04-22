import { EnumNotifyUserType } from '@notify/interfaces';
import {
  AgentDocument,
  BadRequestError,
  CompanyDocument,
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
      throw new BadRequestError('Nota non trovata');
    }

    const agents = await genericUserQuery<false, AgentDocument>(
      EnumNotifyUserType.Agent,
      {
        _id: { $in: note.owners },
      },
      false,
      'profile'
    );

    const company = await genericUserQuery<true, CompanyDocument>(
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
