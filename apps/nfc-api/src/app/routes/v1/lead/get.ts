import {
  INotifyLead,
  INotifyPopulatedLead,
  INotifyUser,
} from '@notify/interfaces';
import {
  AGENT_VALIDATION_MESSAGES,
  LeadModel,
  asyncForEach,
  getAgentOwnerProfile,
  queryUsers,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';
import { Types, isValidObjectId } from 'mongoose';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .optional()
    .custom((value) =>
      value.split(',').every((id: string) => isValidObjectId(id))
    )
    .withMessage(AGENT_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req, res) => {
      const { id } = req.query;

      if (id) {
        res
          .status(200)
          .send(
            await _populateLead(await LeadModel.findById(id as string).lean())
          );
        return;
      }

      const result: INotifyLead[] = await LeadModel.find({
        sharedBy: { $in: [req.currentUser._id] },
        accepted: true,
        deleted: false,
      })
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).send(result);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getLeadRouter };

const _populateLead = async (lead: INotifyLead | null) => {
  if (!lead) {
    return null;
  }

  const createdBy: INotifyUser = (
    await queryUsers({ _id: lead.createdBy }, true, 'profile')
  ).toObject() as INotifyUser;

  const sharedBy = (await queryUsers<false>(
    { _id: { $in: lead.sharedBy } },
    false,
    'profile'
  )) as INotifyUser[];

  const _populatedNotes: INotifyPopulatedLead['notes'] = [];

  await asyncForEach(lead.notes, async (note) => {
    const createdBy = (
      await queryUsers({ _id: note.createdBy }, true, 'profile')
    ).toObject() as INotifyUser;

    _populatedNotes.push({
      ...note,
      createdBy,
    });
  });

  const profile = lead.notifyProfile
    ? await getAgentOwnerProfile(new Types.ObjectId(lead.notifyProfile))
    : null;

  return {
    ...lead,
    createdBy,
    sharedBy,
    notes: _populatedNotes,
    notifyProfile: profile,
  } as INotifyPopulatedLead;
};
