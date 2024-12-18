import {
  EnumNotifyAPAlign,
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPContainerStyles,
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
  UserDocument,
} from '@notify/interfaces';
import mongoose, { Types } from 'mongoose';
import { BadRequestError } from '../errors';
import {
  AgentModel,
  NoteModel,
  ProfileDocument,
  ProfileModel,
} from '../models';
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

export const getProfileFromUserId = async (
  user: Types.ObjectId | string
): Promise<INotifyProfile | undefined> => {
  const profile = await ProfileModel.findOne({ owner: user }).lean();

  if (!profile) {
    throw new BadRequestError('Profile not found');
    return undefined;
  }

  return profile as unknown as INotifyProfile;
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

export const getContactName = (profile: INotifyProfile) => {
  return _getContactOverrides(profile)?.name || _getProfileName(profile);
};

export const getProfileAvatar = (profile: INotifyProfile) => {
  if (!profile.advancedProfile?.enabled) {
    return profile.avatar || '';
  }

  return (
    (
      profile.advancedProfile?.items.find(
        (i) => i._id === profile.advancedProfile?.requiredItems.avatar
      ) as INotifyAPAvatarItem
    )?.imgSrc || ''
  );
};

export const generateFeedbackItem = (profile: INotifyProfile) => {
  return _generateItem<INotifyAPFeedbackItem>(
    EnumNotifyAdvancedProfileItems.Feedback,
    {
      caption: '',
      icon: '',
      url: '',
    }
  );
};

export const upgradeProfileToV2 = async (
  profile: ProfileDocument | null,
  user: UserDocument
) => {
  if (!profile || !user) {
    throw new BadRequestError('Utente non trovato');
  }

  //check if the user has already upgraded to v2
  if (user.advancedProfile) {
    throw new BadRequestError('Profilo già aggiornato');
  }

  user.advancedProfile = true;
  await user.save();

  profile.advancedProfile = _createAdvancedProfile(profile.toObject());

  await profile.save();

  return { profile, user };
};

export const getProfilePlayerUrl = (
  profile: INotifyProfile,
  PLAYER_WEBSITE_URL: string
) => {
  return `${PLAYER_WEBSITE_URL}/p/${profile._id}`;
};

const _getContactOverrides = (profile: INotifyProfile) => {
  if (!profile.advancedProfile?.enabled) {
    return null;
  }

  return profile.advancedProfile.pageSettings.contactOverrides;
};

const _getProfileName = (profile: INotifyProfile): string => {
  if (!profile.advancedProfile?.enabled) {
    return (profile.name || '') + ' ' + (profile.surname || '');
  }

  const avatar = profile.advancedProfile.items.find(
    (i) => i._id === profile.advancedProfile?.requiredItems.avatar
  ) as INotifyAPAvatarItem;

  if (!avatar) {
    return 'Ignoto';
  }

  return avatar.label || 'Ignoto';
};

export const _createAdvancedProfile = (
  profile: INotifyProfile
): INotifyAdvancedProfile => {
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

  return {
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
      topPadding: 0,
      textColor: profile.colors.elements,
      align: EnumNotifyAPAlign.Start,
      padding: 0.5,
      verticalSpacing: 0.5,
      font: 'poppins',
      fontSize: 18,
      redirectUrl: profile.redirectUrl || '',
      hideContactSave: false,
      backgroundBlur: 0,
      backgroundBrightness: 100,
      useCompanyTheme: profile.colors.useCompanyColors || false,
      contactOverrides: {
        name: '',
      },
    },
    requiredItems,
  };
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
  const items = _generateItem<INotifyAPLinksItem>(
    EnumNotifyAdvancedProfileItems.Links,
    {
      direction: EnumNotifyAPDirections.Vertical,
      style: EnumNotifyAPContainerStyles.Filled,
      items: profile.customFields.map((link) => ({
        icon: link.iconName,
        caption: link.iconName,
        url: link.value,
        visible: true,
      })),
    }
  );

  if (!items.items?.length) {
    return null;
  }

  return items;
};

const _generateContactsItem = (profile: INotifyProfile) => {
  const contacts = _generateItem<INotifyAPContactsItem>(
    EnumNotifyAdvancedProfileItems.Contacts,
    {
      direction: EnumNotifyAPDirections.Vertical,
      style: EnumNotifyAPContainerStyles.Outlined,
      items: [],
    }
  );

  profile.phoneNumber = profile.phoneNumber || '';

  if (profile.phoneNumber && profile.config.phoneCallEnabled) {
    contacts.items.push({
      icon: 'phone',
      caption: 'Telefono',
      url: profile.phoneNumber,
      visible: true,
    });
  }

  if (profile.email && profile.config.emailEnabled) {
    contacts.items.push({
      icon: 'mail',
      caption: 'Email',
      url: profile.email || '',
      visible: true,
    });
  }

  if (profile.phoneNumber && profile.config.whatsappEnabled) {
    contacts.items.push({
      icon: 'whatsapp',
      caption: 'WhatsApp',
      url: profile.phoneNumber,
      visible: true,
    });
  }

  if (profile.phoneNumber && profile.config.smsEnabled) {
    contacts.items.push({
      icon: 'chat',
      caption: 'SMS',
      url: profile.phoneNumber,
      visible: true,
    });
  }

  if (!contacts.items.length) {
    return null;
  }

  if (contacts.items.length > 3) {
    contacts.direction = EnumNotifyAPDirections.Horizontal;
    contacts.style = EnumNotifyAPContainerStyles.Text;
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
      label: `${profile.name || ''} ${profile.surname || ''}`,
      sublabel: profile.role || '',
      useRoleSubLabel: profile.type === EnumNotifyUserType.Agent,
      description: profile.bio || '',
      imgSrc: profile.avatar || '',
      imgMask: profile.config.avatarMask || '',
      ownerImgCorner: EnumNotifyAPCorners.BottomRight,
    }
  );

  const feedback = generateFeedbackItem(profile);

  if (
    !profile.config.feedbackEnabled ||
    profile.type === EnumNotifyUserType.Company
  ) {
    return [avatar];
  }

  return [feedback, avatar];
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
