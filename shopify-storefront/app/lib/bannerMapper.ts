/**
 * Banner Data Mapper
 * Transforms Shopify metaobject data into FeatureBanner component props
 */

export interface BannerData {
  eyebrowText?: string;
  heading: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaBgColor?: string;
  ctaTextColor?: string;
  buttonRadius?: number;
  bgImage?: string;
  imageOpacity?: number;
  bgColorStart?: string;
  bgColorEnd?: string;
  headingSize?: number;
  headingColor?: string;
  eyebrowColor?: string;
  descriptionSize?: number;
  textColor?: string;
  textAlignment?: 'left' | 'center' | 'right';
  contentWidth?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingSides?: number;
}

interface MetaobjectField {
  key: string;
  value: string | null;
  type: string;
  reference?: {
    image?: {
      url: string;
      altText?: string;
    };
  } | null;
}

interface Metaobject {
  id: string;
  handle: string;
  type: string;
  fields: MetaobjectField[];
}

/**
 * Default banner values - used as fallbacks
 */
export const DEFAULT_BANNER: BannerData = {
  eyebrowText: "New Arrival",
  heading: "Discover Our Latest Collection",
  description: "Experience premium quality and timeless style with our carefully curated selection.",
  ctaText: "Shop Now",
  ctaUrl: "/products",
  ctaBgColor: "#000000",
  ctaTextColor: "#FFFFFF",
  buttonRadius: 8,
  imageOpacity: 0.3,
  bgColorStart: "#f8f9fa",
  bgColorEnd: "#e9ecef",
  headingSize: 48,
  headingColor: "#1a1a1a",
  eyebrowColor: "#6c757d",
  descriptionSize: 18,
  textColor: "#495057",
  textAlignment: "center",
  contentWidth: 1000,
  paddingTop: 80,
  paddingBottom: 80,
  paddingSides: 40,
};

/**
 * Parse a metaobject field value to the correct type
 */
function parseFieldValue(field: MetaobjectField): any {
  if (!field.value) return null;

  // Handle image references
  if (field.reference && field.reference.image) {
    return field.reference.image.url;
  }

  // Handle different value types
  switch (field.type) {
    case 'number_integer':
      return parseInt(field.value, 10);
    case 'number_decimal':
      return parseFloat(field.value);
    case 'boolean':
      return field.value === 'true' || field.value === '1';
    case 'color':
      return field.value;
    case 'url':
    case 'single_line_text_field':
    case 'multi_line_text_field':
      return field.value;
    default:
      return field.value;
  }
}

/**
 * Map metaobject fields to BannerData
 * Converts the flat array of fields into a structured object
 */
export function mapMetaobjectToBanner(metaobject: Metaobject | null): BannerData {
  if (!metaobject || !metaobject.fields) {
    console.warn('No metaobject provided, using default banner');
    return DEFAULT_BANNER;
  }

  const banner: Partial<BannerData> = {};

  metaobject.fields.forEach((field) => {
    const value = parseFieldValue(field);
    
    switch (field.key) {
      case 'eyebrow_text':
        banner.eyebrowText = value;
        break;
      case 'heading':
        banner.heading = value;
        break;
      case 'description':
        banner.description = value;
        break;
      case 'cta_text':
        banner.ctaText = value;
        break;
      case 'cta_url':
        banner.ctaUrl = value;
        break;
      case 'cta_bg_color':
        banner.ctaBgColor = value;
        break;
      case 'cta_text_color':
        banner.ctaTextColor = value;
        break;
      case 'button_radius':
        banner.buttonRadius = value;
        break;
      case 'bg_image':
        banner.bgImage = value;
        break;
      case 'image_opacity':
        banner.imageOpacity = value;
        break;
      case 'bg_color_start':
        banner.bgColorStart = value;
        break;
      case 'bg_color_end':
        banner.bgColorEnd = value;
        break;
      case 'heading_size':
        banner.headingSize = value;
        break;
      case 'heading_color':
        banner.headingColor = value;
        break;
      case 'eyebrow_color':
        banner.eyebrowColor = value;
        break;
      case 'description_size':
        banner.descriptionSize = value;
        break;
      case 'text_color':
        banner.textColor = value;
        break;
      case 'text_alignment':
        banner.textAlignment = value as 'left' | 'center' | 'right';
        break;
      case 'content_width':
        banner.contentWidth = value;
        break;
      case 'padding_top':
        banner.paddingTop = value;
        break;
      case 'padding_bottom':
        banner.paddingBottom = value;
        break;
      case 'padding_sides':
        banner.paddingSides = value;
        break;
    }
  });

  // Merge with defaults for any missing fields
  return {
    ...DEFAULT_BANNER,
    ...banner,
    // Ensure heading is always present
    heading: banner.heading || DEFAULT_BANNER.heading,
  } as BannerData;
}

/**
 * Extract banner data from Shop metafield reference
 * Useful when using a shop metafield that points to a metaobject
 */
export function extractBannerFromShopMetafield(shopData: any): BannerData {
  try {
    const metafield = shopData?.shop?.metafield;
    
    if (!metafield || !metafield.reference) {
      console.warn('No banner reference found in shop metafield');
      return DEFAULT_BANNER;
    }

    return mapMetaobjectToBanner(metafield.reference);
  } catch (error) {
    console.error('Error extracting banner from shop metafield:', error);
    return DEFAULT_BANNER;
  }
}
