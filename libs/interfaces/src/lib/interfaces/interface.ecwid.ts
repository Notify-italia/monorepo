export interface CatalogResponse {
  expandedCategories: ExpandedCategory[];
  collapsedCategories: any[];
}

export interface ExpandedCategory {
  categoryInfo: CategoryInfo;
  subcategories: any[];
  products: Product[];
  totalProductsCount: number;
  hasMoreProducts: boolean;
}

export interface CategoryInfo {
  id: number;
  name: string;
  description: string;
  categoryPath: any[];
  seo: Seo;
  slugs: Slugs;
}

export interface Seo {
  description: string;
  title: string;
}

export interface Slugs {
  forRouteWithId: string;
}

export interface Product {
  categoryPaths: CategoryPath[];
  condition: string;
  defaultOptionsOverrides: DefaultOptionsOverrides;
  description: string;
  flags: Flags;
  identifier: Identifier;
  jsApiOnly: JsApiOnly;
  name: string;
  options: Option[];
  preselectedOptions: PreselectedOptions;
  seo: Seo2;
  subtitle: string;
  slugs: Slugs3;
  urls: Urls;
}

export interface CategoryPath {
  isDefault: boolean;
  categoryPath: CategoryPath2[];
}

export interface CategoryPath2 {
  id: number;
  name: string;
  slugs: Slugs2;
}

export interface Slugs2 {
  forRouteWithId: string;
}

export interface DefaultOptionsOverrides {
  paymentsOverrides: PaymentsOverrides;
  pricesOverrides: PricesOverrides;
  trackingOverrides: TrackingOverrides;
  variationOverrides: VariationOverrides;
}

export interface PaymentsOverrides {}

export interface PricesOverrides {
  type: string;
  appliedTaxes: AppliedTax[];
  basePrice: number;
  basePriceWithModifiersDiscountAndTaxes: number;
  optionsChoicesWithModifiersAndTaxes: OptionsChoicesWithModifiersAndTax[];
  wholesalePricesWithModifiersAndTaxes: any[];
}

export interface AppliedTax {
  name: string;
  percent: number;
  price: number;
}

export interface OptionsChoicesWithModifiersAndTax {
  optionId: string;
  choices: Choice[];
}

export interface Choice {
  choiceId: string;
  choiceName: string;
  modifierFormatted: string;
}

export interface TrackingOverrides {
  fbPixelContentId: string;
}

export interface VariationOverrides {
  attributes: any[];
  isBaseProductQuantity: boolean;
  isPreorderAllowed: boolean;
  isShippingRequired: boolean;
  isSoldOut: boolean;
  outletsQuantity: OutletsQuantity;
  mediaItems: MediaItem[];
  sku: string;
}

export interface OutletsQuantity {
  quantity: Quantity;
  hasDefinedQuantityForAnyVariation: boolean;
}

export interface Quantity {}

export interface MediaItem {
  type: string;
  id: string;
  isMain: boolean;
  width: number;
  height: number;
  image160pxUrl: string;
  image400pxUrl: string;
  image800pxUrl: string;
  image1500pxUrl: string;
  imageOriginalUrl: string;
  borderInfo: BorderInfo;
  alt: string;
}

export interface BorderInfo {
  dominatingColor: DominatingColor;
  homogeneity: boolean;
}

export interface DominatingColor {
  isDark: boolean;
  isFullyTransparent: boolean;
  rgbHexValue: string;
}

export interface Flags {
  canAddToBagSilently: boolean;
  hasAdjacentProducts: boolean;
  hasIncludedTaxes: boolean;
  hasRelatedProducts: boolean;
  isDemo: boolean;
  isGiftCard: boolean;
  isTermsLinkVisible: boolean;
  hasFreeShipping: boolean;
}

export interface Identifier {
  type: string;
  productId: number;
}

export interface JsApiOnly {
  nameTranslated: NameTranslated;
}

export interface NameTranslated {
  it: string;
}

export interface Option {
  type: string;
  optionId: string;
  optionText: string;
  required: boolean;
}

export interface PreselectedOptions {
  Condizioni?: Condizioni;
  Edizione?: Edizione;
}

export interface Condizioni {
  type: string;
  choice: string;
}

export interface Edizione {
  type: string;
  choice: string;
}

export interface Seo2 {
  description: string;
  jsonLD: string;
  ogMetaTags: OgMetaTags;
  title: string;
  twitterMetaTags: TwitterMetaTags;
}

export interface OgMetaTags {
  title: string;
  url: string;
  image: string;
  site_name: string;
  description: string;
  type: string;
}

export interface TwitterMetaTags {
  card: string;
  title: string;
  description: string;
  image: string;
}

export interface Slugs3 {
  forRouteWithId: string;
  forRouteWithoutId: string;
}

export interface Urls {
  shareUrl: string;
}
