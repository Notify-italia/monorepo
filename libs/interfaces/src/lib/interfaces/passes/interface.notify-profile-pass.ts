export interface IGoogleGenericPassNotifyProfile {
  id: string;
  classId: string;
  logo: Logo;
  cardTitle: CardTitle;
  subheader: Subheader;
  header: Header;
  barcode: Barcode;
  hexBackgroundColor: string;
  heroImage: HeroImage;
}
interface Logo {
  sourceUri: SourceUri;
  contentDescription: ContentDescription;
}
interface SourceUri {
  uri: string;
}
interface ContentDescription {
  defaultValue: DefaultValue;
}
interface DefaultValue {
  language: string;
  value: string;
}
interface CardTitle {
  defaultValue: DefaultValue;
}
interface Subheader {
  defaultValue: DefaultValue;
}
interface Header {
  defaultValue: DefaultValue;
}
interface Barcode {
  type: string;
  value: string;
  alternateText: string;
}
interface HeroImage {
  sourceUri: SourceUri;
  contentDescription: ContentDescription;
}
