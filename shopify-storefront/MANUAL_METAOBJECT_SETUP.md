# Manual Feature Banner Metaobject Setup

Since the automated script requires specific Admin API scopes, follow these manual steps instead:

## Step 1: Create Metaobject Definition

1. Go to **Shopify Admin** > **Settings** > **Custom data**
2. Click **Metaobjects** tab
3. Click **Add definition**
4. Fill in:
   - **Name:** `Feature Banner`
   - **Type:** `feature_banner` (this must be exact)
   - **Description:** `Customizable homepage feature banner`
5. Under **Access**, enable **Storefront** (Public read)

## Step 2: Add All Fields

Click **Add field** for each of these (copy exactly):

### Content Fields
| Name | Key | Type | Required |
|------|-----|------|----------|
| Eyebrow Text | `eyebrow_text` | Single line text | No |
| Heading | `heading` | Single line text | **Yes** |
| Description | `description` | Multi-line text | No |

### CTA Fields
| Name | Key | Type | Required |
|------|-----|------|----------|
| CTA Text | `cta_text` | Single line text | No |
| CTA URL | `cta_url` | Single line text | No |
| CTA Background Color | `cta_bg_color` | Color | No |
| CTA Text Color | `cta_text_color` | Color | No |
| Button Radius | `button_radius` | Integer | No |

**For Button Radius:**
- Min: 0
- Max: 50

### Background Fields
| Name | Key | Type | Required |
|------|-----|------|----------|
| Background Color Start | `bg_color_start` | Color | No |
| Background Color End | `bg_color_end` | Color | No |
| Background Image | `bg_image` | File reference | No |
| Image Opacity | `image_opacity` | Decimal | No |

**For Image Opacity:**
- Min: 0
- Max: 1

### Typography Fields
| Name | Key | Type | Required |
|------|-----|------|----------|
| Heading Size | `heading_size` | Integer | No |
| Heading Color | `heading_color` | Color | No |
| Eyebrow Color | `eyebrow_color` | Color | No |
| Description Size | `description_size` | Integer | No |
| Text Color | `text_color` | Color | No |

**For Heading Size:**
- Min: 24
- Max: 96

**For Description Size:**
- Min: 14
- Max: 32

### Layout Fields
| Name | Key | Type | Required |
|------|-----|------|----------|
| Text Alignment | `text_alignment` | Single line text | No |
| Content Width | `content_width` | Integer | No |
| Padding Top | `padding_top` | Integer | No |
| Padding Bottom | `padding_bottom` | Integer | No |
| Padding Sides | `padding_sides` | Integer | No |

**For Content Width:**
- Min: 600
- Max: 1400

**For Padding Top/Bottom:**
- Min: 0
- Max: 200

**For Padding Sides:**
- Min: 0
- Max: 100

6. Click **Save**

## Step 3: Create Your First Banner Entry

1. Go to **Content** > **Metaobjects**
2. Click **Feature Banner**
3. Click **Add entry**
4. Fill in with your Spring Collection example:

```
Eyebrow Text: Spring Collection 2026
Heading: Style Meets Sustainability
Description: Discover our eco-friendly fashion line crafted with care for both you and the planet. Premium materials, timeless designs.
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

5. Click **Save**
6. **Note the handle** (e.g., `spring-collection-2026`)

## Step 4: Create Shop Metafield

1. Go to **Settings** > **Custom data**
2. Under "Other", click **Shop**
3. Click **Add definition**
4. Fill in:
   - **Name:** `Active Homepage Banner`
   - **Namespace and key:** `custom.active_homepage_banner`
   - **Type:** Metaobject reference
   - **Metaobject:** Feature Banner
5. Under **Access**, enable **Storefront** (Public)
6. Click **Save**

## Step 5: Select Active Banner

1. Still in **Settings** > **Custom data** > **Shop**
2. You should now see "Active Homepage Banner" field
3. Click the dropdown
4. Select "Spring Collection 2026"
5. Click **Save**

## Step 6: Test Your Homepage

```bash
npm run dev
```

Visit your homepage - the banner should now load from the metaobject!

---

## Troubleshooting

### "I don't see the field I just added"
- Click **Save** on the definition first
- Refresh the page
- Add fields one at a time if having issues

### "Keys must be unique"
- Make sure you typed the key exactly as shown
- Keys are case-sensitive and use underscores

### "Can't find Shop in Custom data"
- It's under **Settings** > **Custom data** > **Other**
- Not under "Products" or "Collections"

---

That's it! Your banner is now managed via metaobjects and will display on your homepage.
