import {
  EnumNotifyAPAlign,
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPButtonStyles,
  EnumNotifyAPCorners,
  EnumNotifyAPDirections,
  EnumNotifyAdvancedProfileItems,
  EnumNotifyUserType,
  INotifyAPAvatarItem,
  INotifyAPContactsItem,
  INotifyAPFeedbackItem,
  INotifyAPLinksItem,
  INotifyAPNoteItem,
  INotifyAPPlaceItem,
  INotifyAdvancedProfile,
  INotifyCompany,
  INotifyProfile,
  NotifyAdvancedProfileItem,
} from '@notify/interfaces';
import mongoose, { Types } from 'mongoose';
import { AgentModel, NoteModel, ProfileDocument } from '../models';
import { mLog } from '../services';

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
        populate: 'note',
      },
    })
    .lean();

  if (!agent) {
    mLog('Agent not found, user is not an agent?', 'warning');
    return undefined;
  }

  return (
    agent.owner as unknown as INotifyCompany & { profile: INotifyProfile }
  ).profile;
};

export const populateProfileNote = async (
  profile: INotifyProfile | ProfileDocument
) => {
  const note = await NoteModel.findById(profile.note).lean();

  return {
    ...((profile as ProfileDocument).toJSON() || profile),
    note,
  };
};

export const createAdvancedProfile = (profile: INotifyProfile) => {
  const _requiredItems = _generateRequiredItems(profile);

  const requiredItems = _requiredItems.reduce(
    (acc: INotifyAdvancedProfile['requiredItems'], item) => {
      acc[item.type] = item._id;
      return acc;
    },
    {}
  );

  const items = [
    ..._requiredItems,
    _generateContactsItem(profile),
    _generateLinksItem(profile),
    _generatePlaceItem(profile),
    _generateNoteItem(profile),
  ].filter((item) => item !== null) as NotifyAdvancedProfileItem[];

  profile.advancedProfile = {
    enabled: true,
    items,
    pageSettings: {
      backgroundType: EnumNotifyAPBackgroundTypes.Gradient,
      imgSrc: '',
      fill: '',
      gradient: {
        direction: EnumNotifyAPDirections.Vertical,
        colors: profile.colors.background.map((color) => ({
          value: color,
        })),
      },
      textColor: profile.colors.elements,
      align: EnumNotifyAPAlign.Start,
      padding: 0.5,
      verticalSpacing: 0.5,
      font: 'poppins',
      fontSize: 18,
      redirectUrl: profile.redirectUrl || '',
    },
    requiredItems,
  };

  return profile.advancedProfile;
};

const _generateNoteItem = (profile: INotifyProfile) => {
  if (!profile.note) {
    return null;
  }

  return _generateItem<INotifyAPNoteItem>(EnumNotifyAdvancedProfileItems.Note, {
    note: profile.note as unknown as string,
    showNoteTitle: true,
  });
};

const _generatePlaceItem = (profile: INotifyProfile) => {
  if (!profile.address || !profile.address.street) {
    return null;
  }

  return _generateItem<INotifyAPPlaceItem>(
    EnumNotifyAdvancedProfileItems.Place,
    {
      address: profile.address.street,
      civicNumber: profile.address.number || '',
      city: profile.address.city || '',
      showStreetName: true,
      zoom: 12,
    }
  );
};

const _generateLinksItem = (profile: INotifyProfile) => {
  return _generateItem<INotifyAPLinksItem>(
    EnumNotifyAdvancedProfileItems.Links,
    {
      direction: EnumNotifyAPDirections.Vertical,
      style: EnumNotifyAPButtonStyles.Filled,
      items: profile.customFields.map((link) => ({
        icon: link.iconName,
        caption: link.iconName,
        url: link.value,
        visible: true,
      })),
    }
  );
};

const _generateContactsItem = (profile: INotifyProfile) => {
  const contacts = _generateItem<INotifyAPContactsItem>(
    EnumNotifyAdvancedProfileItems.Contacts,
    {
      direction: EnumNotifyAPDirections.Horizontal,
      style: EnumNotifyAPButtonStyles.Text,
      items: [],
    }
  );

  if (profile.phoneNumber && profile.config.phoneCallEnabled) {
    contacts.items.push({
      icon: 'phone',
      caption: profile.phoneNumber,
      url: `tel:${profile.phoneNumber}`,
      visible: true,
    });
  }

  if (profile.email && profile.config.emailEnabled) {
    contacts.items.push({
      icon: 'mail',
      caption: profile.email,
      url: `mailto:${profile.email}`,
      visible: true,
    });
  }

  if (profile.phoneNumber && profile.config.whatsappEnabled) {
    contacts.items.push({
      icon: 'whatsapp',
      caption: 'WhatsApp',
      url: `https://wa.me/${profile.phoneNumber}`,
      visible: true,
    });
  }

  if (profile.phoneNumber && profile.config.smsEnabled) {
    contacts.items.push({
      icon: 'chat',
      caption: 'SMS',
      url: `sms:${profile.phoneNumber}`,
      visible: true,
    });
  }

  return contacts;
};

const _generateRequiredItems = (
  profile: INotifyProfile
): NotifyAdvancedProfileItem[] => {
  const avatar = _generateItem<INotifyAPAvatarItem>(
    EnumNotifyAdvancedProfileItems.Avatar,
    {
      direction: EnumNotifyAPDirections.Vertical,
      label: `${profile.name} ${profile.surname || ''}`,
      sublabel: profile.role || '',
      useRoleSubLabel: profile.type === EnumNotifyUserType.Agent,
      description: profile.bio || '',
      imgSrc: profile.avatar || '',
      imgMask: profile.config.avatarMask || '',
      ownerImgCorner: EnumNotifyAPCorners.BottomRight,
    }
  );

  const feedback = _generateItem<INotifyAPFeedbackItem>(
    EnumNotifyAdvancedProfileItems.Feedback,
    {
      caption: '',
      icon: '',
      url: '',
    }
  );

  if (
    !profile.config.feedbackEnabled ||
    profile.type === EnumNotifyUserType.Company
  ) {
    return [avatar];
  }

  return [avatar, feedback];
};

const _generateItem = <T>(
  type: EnumNotifyAdvancedProfileItems,
  data: Partial<T>
): T => {
  return <T>{
    type,
    _id: new mongoose.Types.ObjectId().toHexString(),
    visible: true,
    showTitle: true,
    textConfig: {
      enabled: false,
      font: 'poppins',
      fontSize: '18',
      textColor: '',
    },
    ...data,
  };
};
