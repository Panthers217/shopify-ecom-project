# Theme Blocks Documentation

## Available Blocks

### 1. Star Rating Block
**File:** `star_rating.liquid`  
**Target:** `body`  

Displays product ratings with customizable star colors and recommendation text.

**Settings:**
- Product selection (autofill)
- Star color (default: red)

**Features:**
- Shows average rating as stars
- Displays thumbs-up icon and recommendation text for 4+ ratings
- Localization support

---

### 2. Feature Banner Block ⭐ NEW
**File:** `feature_banner.liquid`  
**Target:** `body`

An elegant, fully customizable banner for highlighting promotions, collections, or announcements.

**Settings:**

**Content:**
- Eyebrow text (small label)
- Heading with size control
- Rich text description
- Call-to-action button with URL

**Styling:**
- Background gradient (start/end colors)
- Optional background image with opacity
- Customizable typography (sizes, colors)
- Button styling (background, text color, corner radius)

**Layout:**
- Text alignment (left/center/right)
- Content width control
- Padding controls (top, bottom, sides)

**Features:**
- Responsive design (mobile-optimized)
- Hover animations on CTA button
- Gradient backgrounds with optional image overlay
- Fully customizable through theme editor
- Professional shadows and transitions

**Use Cases:**
- Homepage hero sections
- Collection announcements
- Promotional banners
- Seasonal campaigns
- Product launches
- About page highlights

**Example Implementation:**
See `templates/page.feature-demo.json` for a complete example.

---

## How to Use Blocks

### In Theme Customizer:
1. Go to **Online Store > Themes > Customize**
2. Navigate to the page you want to edit
3. Click **Add block** or **Add section**
4. Select the desired block from the "Apps" category
5. Customize settings in the theme editor sidebar
6. Click **Save**

### In Template Files:
Reference blocks in JSON templates using the format:
```json
{
  "type": "block_name",
  "settings": {
    "setting_key": "value"
  }
}
```

---

## Development Notes

- All blocks use `"target": "body"` to be available throughout the theme
- Blocks support Shopify's theme editor for real-time customization
- Mobile responsiveness is built-in
- Follow Shopify's Liquid and schema guidelines when creating new blocks

---

**Last Updated:** March 27, 2026
