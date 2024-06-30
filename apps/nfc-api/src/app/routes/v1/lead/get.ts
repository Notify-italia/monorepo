import {
  INotifyLead,
  INotifyPopulatedLead,
  INotifyProfile,
  INotifyUser,
  INotifyUserLite,
} from '@notify/interfaces';
import {
  AGENT_VALIDATION_MESSAGES,
  LeadModel,
  asyncForEach,
  getAgentOwnerProfile,
  getContactName,
  getProfileAvatar,
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
            await _populateLead(
              await LeadModel.findOne({ _id: id, deleted: false }).lean()
            )
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

  const sharedBy: INotifyUserLite[] = (
    await queryUsers<false>({ _id: { $in: lead.sharedBy } }, false, 'profile')
  )
    .filter((v) => v.profile)
    .map((u) => ({
      _id: u._id,
      alias: getContactName(u.profile as INotifyProfile),
      avatar: getProfileAvatar(u.profile as INotifyProfile),
    }));

  const _populatedNotes: INotifyPopulatedLead['comments'] = [];

  await asyncForEach(lead.comments, async (comment) => {
    const createdBy = (
      await queryUsers({ _id: comment.createdBy }, true, 'profile')
    ).toObject() as INotifyUser;

    if (!createdBy.profile) {
      _populatedNotes.push({
        ...comment,
        createdBy: {
          _id: '',
          alias: 'Eliminato',
          avatar: '',
        },
      });

      return;
    }

    _populatedNotes.push({
      ...comment,
      createdBy: {
        _id: createdBy._id,
        alias: getContactName(createdBy.profile),
        avatar: getProfileAvatar(createdBy.profile),
      },
    });
  });

  const profile = lead.notifyProfile
    ? await getAgentOwnerProfile(new Types.ObjectId(lead.notifyProfile))
    : null;

  if (!createdBy.profile) {
    return {
      ...lead,
      createdBy: {
        _id: '',
        alias: 'Eliminato',
        avatar: '',
      },
      sharedBy,
      comments: _populatedNotes,
      notifyProfile: profile,
    } as INotifyPopulatedLead;
  }

  return {
    ...lead,
    createdBy: {
      _id: createdBy._id,
      alias: getContactName(createdBy.profile),
      avatar: getProfileAvatar(createdBy.profile),
    },
    sharedBy,
    comments: _populatedNotes,
    notifyProfile: profile,
  } as INotifyPopulatedLead;
};
