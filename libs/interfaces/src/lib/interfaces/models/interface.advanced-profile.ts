import { DaisyUIAvatarMasks } from './interface.profile';

/*
PUBLIC INTERFACES
*/

//base interface
export interface INotifyAdvancedProfile {
  enabled: boolean;
  pageSettings: INotifyAPageSettings;
  requiredItems: {
    avatar: string;
  };
  items: INotifyAdcancedProfileItems[];
}

export type INotifyAdcancedProfileItems =
  | INotifyAPAvatarItem
  | INotifyAPFeedbackItem
  | INotifyAPLinksItem
  | INotifyAPPlaceItem
  | INotifyAPContactsItem
  | INotifAPPhotoItem
  | INotifyAPNoteItem;

//avatar
export interface INotifyAPAvatarItem
  extends _INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Avatar> {
  direction: EnumNotifyAPDirections;
  title: string;
  subtitle: string;
  description: string;
  imgSrc: string;
  imgMask: DaisyUIAvatarMasks;
  ownerImgCorner: EnumNotifyAPCorners;
  ownerImgPath: string;
}

//feedback
export interface INotifyAPFeedbackItem
  extends _INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Feedback>,
    _baseButton {}

//links
export interface INotifyAPLinksItem
  extends _INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Links> {
  items: INotifyAPLinkItem[];
  style: EnumNotifyAPButtonStyles;
  direction: EnumNotifyAPDirections;
}
export type INotifyAPLinkItem = _baseButton;

//place
export interface INotifyAPPlaceItem
  extends _INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Place> {
  address: string;
  city: string;
  showStreetName: boolean;
}

//contacts
export interface INotifyAPContactsItem
  extends _INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Contacts> {
  items: INotifyContactItem[];
}
export type INotifyContactItem = _baseButton;

//photo
export interface INotifAPPhotoItem
  extends _INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Photo> {
  imgSrc: string;
  title: string;
}

//note
export interface INotifyAPNoteItem
  extends _INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Note> {
  note: string;
  showNoteTitle: boolean;
}

export interface INotifyAPIframeItem
  extends _INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Iframe> {
  url: string;
}

export interface INotifyAPageSettings {
  backgroundType: EnumNotifyAPBackgroundTypes;
  imgSrc: string;
  fill: string;
  gradient: {
    direction: EnumNotifyAPDirections;
    colors: string[];
  };
  pattern: {
    pattern: string;
    color: string;
  };
  textColor: string;
  font: string;
  fontSize: string;
  align: EnumNotifyAPAlign;
}

export interface INotifyAPAvailableItem {
  label: string;
  type: EnumNotifyAdvancedProfileItems;
  icon: string[];
}
/*
ENUMS
*/
export enum EnumNotifyAPDirections {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export enum EnumNotifyAPCorners {
  None = 'none',
  TopLeft = 'top',
  TopRight = 'right',
  BottomLeft = 'bottom',
  BottomRight = 'left',
}

export enum EnumNotifyAPButtonStyles {
  Filled = 'filled',
  Outlined = 'outlined',
  Text = 'text',
}

export enum EnumNotifyAPBackgroundTypes {
  Image = 'image',
  Fill = 'fill',
  Gradient = 'gradient',
  Pattern = 'pattern',
}

export enum EnumNotifyAPAlign {
  Start = 'start',
  Center = 'center',
  End = 'end',
}

export enum EnumNotifyAdvancedProfileItems {
  Avatar = 'avatar',
  Feedback = 'feedback',
  Links = 'links',
  Place = 'place',
  Contacts = 'contacts',
  Photo = 'photo',
  Note = 'note',
  Iframe = 'iframe',
}

/*
CONSTS
*/
export const NOTIFY_ITEM_TYPES_IT = {
  [EnumNotifyAdvancedProfileItems.Avatar]: 'Avatar',
  [EnumNotifyAdvancedProfileItems.Feedback]: 'Feedback',
  [EnumNotifyAdvancedProfileItems.Links]: 'Links',
  [EnumNotifyAdvancedProfileItems.Place]: 'Posizione',
  [EnumNotifyAdvancedProfileItems.Contacts]: 'Contatti',
  [EnumNotifyAdvancedProfileItems.Photo]: 'Immagine',
  [EnumNotifyAdvancedProfileItems.Note]: 'Nota',
  [EnumNotifyAdvancedProfileItems.Iframe]: 'Sito Web',
};

export const NOTIFY_AVAILABLE_ITEMS: INotifyAPAvailableItem[] = [
  {
    label: NOTIFY_ITEM_TYPES_IT[EnumNotifyAdvancedProfileItems.Avatar],
    type: EnumNotifyAdvancedProfileItems.Avatar,
    icon: [
      'M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z',
    ],
  },
  {
    label: NOTIFY_ITEM_TYPES_IT[EnumNotifyAdvancedProfileItems.Photo],
    type: EnumNotifyAdvancedProfileItems.Photo,
    icon: [
      'M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z',
    ],
  },
  {
    label: NOTIFY_ITEM_TYPES_IT[EnumNotifyAdvancedProfileItems.Feedback],
    type: EnumNotifyAdvancedProfileItems.Feedback,
    icon: [
      'M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z',
    ],
  },
  {
    label: NOTIFY_ITEM_TYPES_IT[EnumNotifyAdvancedProfileItems.Contacts],
    type: EnumNotifyAdvancedProfileItems.Contacts,
    icon: [
      'M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z',
    ],
  },
  {
    label: NOTIFY_ITEM_TYPES_IT[EnumNotifyAdvancedProfileItems.Note],
    type: EnumNotifyAdvancedProfileItems.Note,
    icon: [
      'M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z',
      'M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z',
    ],
  },
  {
    label: NOTIFY_ITEM_TYPES_IT[EnumNotifyAdvancedProfileItems.Place],
    type: EnumNotifyAdvancedProfileItems.Place,
    icon: [
      'm11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    ],
  },
  {
    label: NOTIFY_ITEM_TYPES_IT[EnumNotifyAdvancedProfileItems.Links],
    type: EnumNotifyAdvancedProfileItems.Links,
    icon: [
      'M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z',
    ],
  },
  {
    label: NOTIFY_ITEM_TYPES_IT[EnumNotifyAdvancedProfileItems.Iframe],
    type: EnumNotifyAdvancedProfileItems.Iframe,
    icon: [
      'M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z',
    ],
  },
];

/*
PRIVATE INTERFACES
*/
interface _INotifyAdvancedProfileItem<
  T extends EnumNotifyAdvancedProfileItems
> {
  type: T;
  clickEvent: string;
  clickEventData: string;
  visible: boolean;
  title: string;
  showTitle: boolean;
  _id: string;
}

interface _baseButton {
  caption: string;
  icon: string;
  url: string;
}
