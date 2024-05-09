import { DaisyUIAvatarMasks } from './interface.profile';

/*
PUBLIC INTERFACES
*/

//base interface
export interface INotifyAdvancedProfile {
  enabled: boolean;
  root: INotifyAPRoot;
  avatar: INotifyAPAvatarItem;
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

export interface INotifyAPRoot {
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
