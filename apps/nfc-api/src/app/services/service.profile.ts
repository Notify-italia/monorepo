import { INotifyCompany, INotifyProfile } from '@notify/interfaces';
import { Types } from 'mongoose';
import { AgentModel } from '../models/model.agent';

/**
 * The function `companyProfile` retrieves the profile of a company associated with an agent, given the
 * agent's profile ID.
 * @param profileId - The `profileId` parameter is the unique identifier of a profile. It is used to
 * find an agent in the database whose profile matches the given `profileId`.
 * @returns The function `companyProfile` returns the `profile` property of the `company` object.
 */
export const getAgentOwnerProfile = async (profileId: Types.ObjectId) => {
  const agent = await AgentModel.findOne({ profile: profileId })
    .populate({
      path: 'owner',
      populate: {
        path: 'profile',
        model: 'Profile',
      },
    })
    .lean();

  if (!agent) {
    return undefined;
  }

  return (
    agent.owner as unknown as INotifyCompany & { profile: INotifyProfile }
  ).profile;
};
