import { DaisyUIAvatarMasks } from './interface.profile';

/*
PUBLIC INTERFACES
*/

//base interface
export interface INotifyAdvancedProfile {
  enabled: boolean;
  pageSettings: INotifyAPageSettings;
  requiredItems: {
    [key in EnumNotifyAdvancedProfileItems]?: string | null;
  };
  items: NotifyAdvancedProfileItem[];
}

export type NotifyAdvancedProfileItem =
  | INotifyAPAvatarItem
  | INotifyAPFeedbackItem
  | INotifyAPLinksItem
  | INotifyAPPlaceItem
  | INotifyAPContactsItem
  | INotifyAPPhotoItem
  | INotifyAPNoteItem
  | INotifyAPIFrameItem
  | INotifyAPDividerItem;

export type NotifyAdvancedProfileItemTypes =
  | NotifyAdvancedProfileItem['type']
  | EnumNotifyAdvancedProfileItems.Unknown;

//avatar
export interface INotifyAPAvatarItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Avatar> {
  direction: EnumNotifyAPDirections;
  align: EnumNotifyAPAlign;
  label: string;
  sublabel: string;
  description: string;
  imgSrc: string;
  imgMask: DaisyUIAvatarMasks | 'banner' | 'adaptive';
  imgFit: EnumNotifyAPObjectFit;
  imgSize: number;
  useRoleSubLabel: boolean;
  ownerImgCorner: EnumNotifyAPCorners;
}

//feedback
export interface INotifyAPFeedbackItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Feedback>,
    baseButton {}

//links
export interface INotifyAPLinksItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Links> {
  items: INotifyAPLinkItem[];
  style: EnumNotifyAPButtonStyles;
  openInNotify: boolean;
  direction: EnumNotifyAPDirections;
}
export type INotifyAPLinkItem = baseButton;

//place
export interface INotifyAPPlaceItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Place> {
  address: string;
  civicNumber: string;
  city: string;
  showStreetName: boolean;
  companyName: string;
  zoom: number;
}

//contacts
export interface INotifyAPContactsItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Contacts> {
  items: INotifyAPContactItem[];
  style: EnumNotifyAPButtonStyles;
  direction: EnumNotifyAPDirections;
}
export type INotifyAPContactItem = baseButton;

//photo
export interface INotifyAPPhotoItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Photo> {
  imgSrc: string;
  showCompanyOnClick: boolean;
  dimension: number;
  align: EnumNotifyAPAlign;
}

//note
export interface INotifyAPNoteItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Note> {
  note: string;
  showNoteTitle: boolean;
}

export type INotifyAPDividerItem =
  INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.Divider>;

export interface INotifyAPIFrameItem
  extends INotifyAdvancedProfileItem<EnumNotifyAdvancedProfileItems.IFrame> {
  url: string;
  openInNotify: boolean;
}

export interface INotifyAdvancedProfileItem<
  T extends EnumNotifyAdvancedProfileItems = EnumNotifyAdvancedProfileItems
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> {
  type: T;
  visible: boolean;
  title: string;
  showTitle: boolean;
  textConfig: {
    enabled: boolean;
    font: string;
    fontSize: number;
    textColor: string;
  };
  _id: string;
}

export interface INotifyAPageSettings {
  backgroundType: EnumNotifyAPBackgroundTypes;
  imgSrc: string;
  fill: string;
  gradient: {
    direction: EnumNotifyAPDirections;
    colors: { value: string }[];
  };
  textColor: string;
  font: string;
  fontSize: number;
  align: EnumNotifyAPAlign;
  padding: number;
  verticalSpacing: number;
  /**
   * duplicato di INotifyProfile['redirectUrl'] dato che l'editor non ha accesso a INotifyProfile ma solo a INotifyAdvancedProfile
   */
  redirectUrl: string;
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
  TopLeft = 'top-left',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
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
}

export enum EnumNotifyAPAlign {
  Start = 'flex-start',
  Center = 'center',
  End = 'flex-end',
}

export enum EnumNotifyAPObjectFit {
  Fill = 'fill',
  Contain = 'contain',
  Cover = 'cover',
  None = 'none',
  ScaleDown = 'scale-down',
}

export enum EnumNotifyAdvancedProfileItems {
  Avatar = 'avatar',
  Feedback = 'feedback',
  Links = 'links',
  Place = 'place',
  Contacts = 'contacts',
  Photo = 'photo',
  Note = 'note',
  IFrame = 'iframe',
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

export const NOTIFY_AP_BUTTON_STYLES_IT: {
  [key in EnumNotifyAPButtonStyles]: string;
} = {
  [EnumNotifyAPButtonStyles.Filled]: 'Riempito',
  [EnumNotifyAPButtonStyles.Outlined]: 'Tracciato',
  [EnumNotifyAPButtonStyles.Text]: 'Testo',
};

export const NOTIFY_AP_OWNER_IMG_CORNER_IT: {
  [key in EnumNotifyAPCorners]: string;
} = {
  [EnumNotifyAPCorners.None]: 'Nascosto',
  [EnumNotifyAPCorners.TopLeft]: 'In alto a sinistra',
  [EnumNotifyAPCorners.TopRight]: 'In alto a destra',
  [EnumNotifyAPCorners.BottomLeft]: 'In basso a sinistra',
  [EnumNotifyAPCorners.BottomRight]: 'In basso a destra',
};

export const NOTIFY_AP_BACKGROUND_TYPES_IT: {
  [key in EnumNotifyAPBackgroundTypes]: string;
} = {
  [EnumNotifyAPBackgroundTypes.Image]: 'Immagine',
  [EnumNotifyAPBackgroundTypes.Fill]: 'Tinta Unita',
  [EnumNotifyAPBackgroundTypes.Gradient]: 'Gradiente',
};

export const NOTIFY_AP_OBJECT_FIT_IT: {
  [key in EnumNotifyAPObjectFit]: string;
} = {
  [EnumNotifyAPObjectFit.Fill]: 'Riempi',
  [EnumNotifyAPObjectFit.Contain]: 'Contieni',
  [EnumNotifyAPObjectFit.Cover]: 'Copri',
  [EnumNotifyAPObjectFit.None]: 'Nessuno',
  [EnumNotifyAPObjectFit.ScaleDown]: 'Ridimensiona',
};

export const NOTIFY_AP_ALIGN_IT: {
  [key in EnumNotifyAPAlign]: string;
} = {
  [EnumNotifyAPAlign.Start]: 'Inizio',
  [EnumNotifyAPAlign.Center]: 'Centro',
  [EnumNotifyAPAlign.End]: 'Fine',
};

/*
UTILS INTERFACES
*/
export interface baseButton {
  caption: string;
  icon: string;
  url: string;
  visible: boolean;
}

export interface baseFile {
  name: string;
  url: string;
  size: number;
  type: string;
}
