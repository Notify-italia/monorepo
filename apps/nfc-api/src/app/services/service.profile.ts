import { INotifyCompany, INotifyProfile } from '@notify/interfaces';
import { Types } from 'mongoose';
import { wLog } from '../../main';
import { AgentModel } from '../models/model.agent';

/**
 * The function `companyProfile` retrieves the profile of a company associated with an agent, given the
 * agent's profile ID.
 * @param profileId - The `profileId` parameter is the unique identifier of a profile. It is used to
 * find an agent in the database whose profile matches the given `profileId`.
 * @returns The function `companyProfile` returns the `profile` property of the `company` object.
 */
export const getAgentOwnerProfile = async (agentId: Types.ObjectId) => {
  const agent = await AgentModel.findOne({ _id: agentId })
    .populate({
      path: 'owner',
      populate: {
        path: 'profile',
        model: 'Profile',
      },
    })
    .lean();

  if (!agent) {
    wLog('Agent not found', 'warning');
    return undefined;
  }

  return (
    agent.owner as unknown as INotifyCompany & { profile: INotifyProfile }
  ).profile;
};
