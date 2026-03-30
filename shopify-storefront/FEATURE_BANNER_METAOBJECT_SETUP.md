# Feature Banner Metaobject Setup Guide

## Overview

Your feature banner is now powered by **Shopify Metaobjects** - a flexible content management system that allows you to:

✅ Create multiple banner designs  
✅ Switch between banners instantly from Shopify Admin  
✅ No code changes needed to update content  
✅ Preview and prepare content ahead of time  
✅ Full control over design and styling  

---

## Architecture

```
Shopify Admin
├── Metaobjects (Content Library)
│   ├── spring-collection-2026 (Banner Entry 1)
│   ├── summer-sale-2026      (Banner Entry 2)
│   └── fall-fashion-2026     (Banner Entry 3)
│
└── Shop Metafield: custom.active_homepage_banner
    └── Points to → spring-collection-2026
    
When homepage loads:
1. Fetch shop.metafield.custom.active_homepage_banner
2. Get the referenced metaobject (banner data)
3. Render FeatureBanner component with that data
```

---

## Setup Instructions

### Option 1: Automated Setup (Recommended)

Run the setup script to create the metaobject definition automatically:

```bash
cd /workspaces/shopify-ecom-project/shopify-storefront
npx tsx scripts/setupFeatureBannerMetaobject.ts
```

**Prerequisites:**
- You need an Admin API access token in your `.env` file
- Variable: `SHOPIFY_ADMIN_ACCESS_TOKEN`

### Option 2: Manual Setup

If you prefer to set up manually or the script doesn't work:

#### Step 1: Create Metaobject Definition

1. Go to **Shopify Admin** > **Settings** > **Custom data**
2. Click **Metaobjects** tab
3. Click **Add definition**
4. Set:
   - **Name:** Feature Banner
   - **Type:** `feature_banner`
   - **Description:** Customizable homepage feature banner

5. **Add these fields:**

| Field Name | Key | Type | Description | Required |
|------------|-----|------|-------------|----------|
| Eyebrow Text | `eyebrow_text` | Single line text | Small text above heading | No |
| Heading | `heading` | Single line text | Main headline | **Yes** |
| Description | `description` | Multi-line text | Supporting text | No |
| CTA Text | `cta_text` | Single line text | Button text | No |
| CTA URL | `cta_url` | Single line text | Button link | No |
| CTA Background Color | `cta_bg_color` | Color | Button background | No |
| CTA Text Color | `cta_text_color` | Color | Button text color | No |
| Button Radius | `button_radius` | Integer | Corner radius (0-50) | No |
| Background Color Start | `bg_color_start` | Color | Gradient start | No |
| Background Color End | `bg_color_end` | Color | Gradient end | No |
| Background Image | `bg_image` | File reference | Optional image | No |
| Image Opacity | `image_opacity` | Decimal | Image opacity (0-1) | No |
| Heading Size | `heading_size` | Integer | Font size (24-96) | No |
| Heading Color | `heading_color` | Color | Heading color | No |
| Eyebrow Color | `eyebrow_color` | Color | Eyebrow color | No |
| Description Size | `description_size` | Integer | Font size (14-32) | No |
| Text Color | `text_color` | Color | Description color | No |
| Text Alignment | `text_alignment` | Single line text | left/center/right | No |
| Content Width | `content_width` | Integer | Max width (600-1400) | No |
| Padding Top | `padding_top` | Integer | Top padding (0-200) | No |
| Padding Bottom | `padding_bottom` | Integer | Bottom padding (0-200) | No |
| Padding Sides | `padding_sides` | Integer | Side padding (0-100) | No |

6. Under **Access**, enable **Storefront access** (set to Public)
7. Click **Save**

---

## Creating Your First Banner

### Step 1: Create a Banner Entry

1. Go to **Shopify Admin** > **Content** > **Metaobjects**
2. Click **Feature Banner**
3. Click **Add entry**
4. Fill in the fields (see example below)
5. Click **Save**
6. **Note the handle** (URL-friendly name, e.g., `spring-collection-2026`)

### Example: Spring Collection Banner

```
Eyebrow Text: Spring Collection 2026
Heading: Style Meets Sustainability
Description: Discover our eco-friendly fashion line crafted with care for both you and the planet.
CTA Text: Shop Spring Collection
CTA URL: /collections/spring-2026
CTA Background Color: #2d6a4f
CTA Text Color: #ffffff
Button Radius: 8
Background Color Start: #d8f3dc
Background Color End: #b7e4c7
Heading Size: 56
Heading Color: #1b4332
Eyebrow Color: #52b788
Description Size: 18
Text Color: #2d6a4f
Text Alignment: center
Content Width: 1000
Padding Top: 100
Padding Bottom: 100
Padding Sides: 40
Image Opacity: 0.2
```

### Step 2: Create Shop Metafield for Active Banner

1. Go to **Shopify Admin** > **Settings** > **Custom data**
2. Click **Shop** (under "Other")
3. Click **Add definition**
4. Set:
   - **Name:** Active Homepage Banner
   - **Namespace and key:** `custom.active_homepage_banner`
   - **Type:** Metaobject reference
   - **Select metaobject:** Feature Banner
   - **Access:** Storefront (Public read)
5. Click **Save**

### Step 3: Select Active Banner

1. Go to **Shopify Admin** > **Settings** > **Metafields**
2. You should see "Active Homepage Banner"
3. Click the dropdown and select your banner (e.g., "Spring Collection 2026")
4. Click **Save**

---

## How It Works

### Code Flow

1. **Homepage loads** [`app/routes/_index.tsx`]
2. **Loader fetches data** via `GET_SHOP_METAFIELDS_QUERY`
3. **Shop metafield** returns reference to active banner metaobject
4. **Banner mapper** [`app/lib/bannerMapper.ts`] transforms metaobject data
5. **Component renders** with dynamic props

### Files Modified

| File | Purpose |
|------|---------|
| `app/lib/queries.ts` | Added metaobject GraphQL queries |
| `app/lib/bannerMapper.ts` | Maps metaobject data to component props |
| `app/routes/_index.tsx` | Fetches and displays dynamic banner |
| `scripts/setupFeatureBannerMetaobject.ts` | Automated setup script |

---

## Managing Banners

### Creating Multiple Banners

1. Create multiple banner entries in **Content** > **Metaobjects** > **Feature Banner**
2. Give each one a unique handle:
   - `spring-collection-2026`
   - `summer-sale-2026`
   - `fall-fashion-2026`
   - `holiday-collection-2026`

### Switching Active Banner

1. Go to **Settings** > **Metafields**
2. Change the **Active Homepage Banner** dropdown
3. Save
4. Your homepage updates instantly (no code deployment needed!)

### Creating Seasonal Campaigns

**Prepare ahead of time:**
1. Create all seasonal banners in advance
2. Each with different colors, images, and messaging
3. When the season arrives, just change the dropdown

**Example workflow:**
- January: Create Spring banner
- February: Create Summer banner
- March 1st: Switch to Spring banner (takes 10 seconds)
- June 1st: Switch to Summer banner

---

## Fallback Behavior

If the metaobject or shop metafield is not set up, the app will use default values defined in `/app/lib/bannerMapper.ts`:

```typescript
{
  eyebrowText: "New Arrival",
  heading: "Discover Our Latest Collection",
  description: "Experience premium quality...",
  ctaText: "Shop Now",
  ctaUrl: "/products",
  // ... etc
}
```

This ensures your site never breaks if data is missing.

---

## Advanced: Direct Metaobject Query

If you want to fetch a specific banner by handle (without using shop metafield):

```typescript
import { GET_FEATURE_BANNER_QUERY } from "~/lib/queries";
import { mapMetaobjectToBanner } from "~/lib/bannerMapper";

const { metaobject } = await storefrontFetch(GET_FEATURE_BANNER_QUERY, {
  handle: "spring-collection-2026"
});

const bannerData = mapMetaobjectToBanner(metaobject);
```

---

## Troubleshooting

### "Metaobject not found" error

**Cause:** Metaobject definition doesn't exist or wrong type name  
**Fix:** Run setup script or verify definition type is exactly `feature_banner`

### Banner shows default content

**Cause:** Shop metafield not configured  
**Fix:** Follow Step 2 & 3 in "Creating Your First Banner" section

### Banner missing some styling

**Cause:** Some fields are optional  
**Fix:** Fill in all desired fields in the metaobject entry, or accept the defaults

### Changes not appearing

**Cause:** Caching  
**Fix:** Hard refresh browser (Ctrl+Shift+R) or wait a few seconds

---

## Benefits of This Approach

✅ **No code changes** for content updates  
✅ **Marketing team can manage** banners independently  
✅ **Prepare campaigns ahead** of time  
✅ **A/B test different banners** (switch and compare analytics)  
✅ **Seasonal flexibility** (4+ banners ready to go)  
✅ **Consistent design system** (all banners use same structure)  
✅ **Scalable** (add more banner types or locations later)  

---

## Next Steps

1. Run the setup script or complete manual setup
2. Create your first banner entry
3. Set up the shop metafield
4. Visit your homepage to see the banner
5. Create additional seasonal banners for future campaigns

**Questions?** Check the console logs for detailed error messages or review the code in:
- `/app/lib/bannerMapper.ts`
- `/app/routes/_index.tsx`
