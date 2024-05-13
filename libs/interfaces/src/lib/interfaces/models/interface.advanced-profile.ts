import { DaisyUIAvatarMasks } from './interface.profile';

/*
PUBLIC INTERFACES
*/

//base interface
export interface INotifyAdvancedProfile {
  enabled: boolean;
  pageSettings: INotifyAPageSettings;
  requiredItems: {
    avatar: string | null;
  };
  items: NotifyAdvancedProfileItem[];
}

export type NotifyAdvancedProfileItem =
  | INotifyAPAvatarItem
  | INotifyAPFeedbackItem
  | INotifyAPLinksItem
  | INotifyAPPlaceItem
  | INotifyAPContactsItem
  | INotifAPPhotoItem
  | INotifyAPNoteItem
  | INotifyAPIframeItem
  | INotifyAPDividerItem;

export type NotifyAdvancedProfileItemTypes =
  | NotifyAdvancedProfileItem['type']
  | EnumNotifyAdvancedProfileItems.Unknown;

//avatar
export interface INotifyAPAvatarItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Avatar> {
  direction: EnumNotifyAPDirections;
  label: string;
  sublabel: string;
  description: string;
  imgSrc: { name: string; url: string; size: number; type: string }[];
  imgMask: DaisyUIAvatarMasks | 'banner';
  useRoleSubLabel: boolean;
  ownerImgCorner: EnumNotifyAPCorners;
}

//feedback
export interface INotifyAPFeedbackItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Feedback>,
    _baseButton {}

//links
export interface INotifyAPLinksItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Links> {
  items: INotifyAPLinkItem[];
  style: EnumNotifyAPButtonStyles;
  direction: EnumNotifyAPDirections;
}
export type INotifyAPLinkItem = _baseButton;

//place
export interface INotifyAPPlaceItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Place> {
  address: string;
  civicNumber: string;
  city: string;
  showStreetName: boolean;
}

//contacts
export interface INotifyAPContactsItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Contacts> {
  items: INotifyContactItem[];
}
export type INotifyContactItem = _baseButton;

//photo
export interface INotifAPPhotoItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Photo> {
  imgSrc: string;
}

//note
export interface INotifyAPNoteItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Note> {
  note: string;
  showNoteTitle: boolean;
}

export type INotifyAPDividerItem =
  INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Divider>;

export interface INotifyAPIframeItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Iframe> {
  url: string;
}

export interface INotifyAdvancedProfileItem<
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
  fontSize: number;
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
  TopLeft = 'topLeft',
  TopRight = 'TopRight',
  BottomLeft = 'bottomLeft',
  BottomRight = 'bottomRight',
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
  Unknown = 'unknown',
  Divider = 'divider',
}

export const NOTIFY_AP_FONTS = {
  Poppins: 'Poppins',
  Roboto: 'Roboto',
  Montserrat: 'Montserrat',
  Lato: 'Lato',
  OpenSans: 'Open Sans',
  Ubuntu: 'Ubuntu',
  Nunito: 'Nunito',
  Raleway: 'Raleway',
  Merriweather: 'Merriweather',
  PlayfairDisplay: 'Playfair Display',
  Oswald: 'Oswald',
  Lora: 'Lora',
  SourceSansPro: 'Source Sans Pro',
  WorkSans: 'Work Sans',
  NotoSans: 'Noto Sans',
  Quicksand: 'Quicksand',
  Arimo: 'Arimo',
  TitilliumWeb: 'Titillium Web',
  Muli: 'Muli',
  Hind: 'Hind',
  NunitoSans: 'Nunito Sans',
  Barlow: 'Barlow',
  Oxygen: 'Oxygen',
  FiraSans: 'Fira Sans',
  PTSans: 'PT Sans',
  Dosis: 'Dosis',
  Asap: 'Asap',
  Rubik: 'Rubik',
};

export const NOTIFY_AP_DIRECTIONS_IT: {
  [key in EnumNotifyAPDirections]: string;
} = {
  [EnumNotifyAPDirections.Horizontal]: 'Orizzontale',
  [EnumNotifyAPDirections.Vertical]: 'Verticale',
};

export const NOTIFY_AP_OWNER_IMG_CORNER_IT: {
  [key in EnumNotifyAPCorners]: string;
} = {
  [EnumNotifyAPCorners.None]: 'Nessuna',
  [EnumNotifyAPCorners.TopLeft]: 'In alto a sinistra',
  [EnumNotifyAPCorners.TopRight]: 'In alto a destra',
  [EnumNotifyAPCorners.BottomLeft]: 'In basso a sinistra',
  [EnumNotifyAPCorners.BottomRight]: 'In basso a destra',
};

/*
PRIVATE INTERFACES
*/
interface _baseButton {
  caption: string;
  icon: string;
  url: string;
  visible: boolean;
}
