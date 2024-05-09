import { DaisyUIAvatarMasks } from './interface.profile';

/*
PUBLIC INTERFACES
*/

//base interface
export interface INotifyAdvancedProfile {
  enabled: boolean;
  root: INotifyAPRoot;
  avatar: INotifyAPAvatarItem;
  items: INotifyAdcancedProfileItems;
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
export interface INotifyAPAvatarItem extends _INotifyAdvancedProfileItem {
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
  extends _INotifyAdvancedProfileItem,
    _baseButton {}

//links
export interface INotifyAPLinksItem extends _INotifyAdvancedProfileItem {
  items: INotifyAPLinkItem[];
  style: EnumNotifyAPButtonStyles;
  direction: EnumNotifyAPDirections;
}
export type INotifyAPLinkItem = _baseButton;

//place
export interface INotifyAPPlaceItem extends _INotifyAdvancedProfileItem {
  address: string;
  city: string;
  showTitle: boolean;
}

//contacts
export interface INotifyAPContactsItem extends _INotifyAdvancedProfileItem {
  items: INotifyContactItem[];
}
export type INotifyContactItem = _baseButton;

//photo
export interface INotifAPPhotoItem extends _INotifyAdvancedProfileItem {
  imgSrc: string;
  title: string;
}

//note
export interface INotifyAPNoteItem extends _INotifyAdvancedProfileItem {
  note: string;
  showTitle: boolean;
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

/*
PRIVATE INTERFACES
*/
interface _INotifyAdvancedProfileItem {
  clickEvent: string;
  clickEventData: string;
  visible: boolean;
}

interface _baseButton {
  caption: string;
  icon: string;
  url: string;
}
