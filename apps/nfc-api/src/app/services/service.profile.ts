import { Types } from 'mongoose';
import { AgentModel } from '../models/model.agent';
import { CompanyDocument } from '../models/model.company';

/**
 * The function `companyProfile` retrieves the profile of a company associated with an agent, given the
 * agent's profile ID.
 * @param profileId - The `profileId` parameter is the unique identifier of a profile. It is used to
 * find an agent in the database whose profile matches the given `profileId`.
 * @returns The function `companyProfile` returns the `profile` property of the `company` object.
 */
export const getCompanyProfile = async (profileId: Types.ObjectId) => {
  const agent = await AgentModel.findOne({ profile: profileId })
    .populate({
      path: 'company',
      populate: {
        path: 'profile',
        model: 'Profile',
      },
    })
    .lean();

  if (!agent) {
    return undefined;
  }

  return (agent.company as unknown as CompanyDocument).profile;
};
