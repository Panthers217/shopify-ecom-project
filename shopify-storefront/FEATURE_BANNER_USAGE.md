# Feature Banner Component - Usage Guide

## Overview
The Feature Banner is an elegant, fully customizable React component for highlighting promotions, new collections, or important announcements in your Remix Shopify storefront.

## Implementation

The Feature Banner is implemented as a React component in the Remix app and can be used on any page.

**Component Location:** `app/components/sections/FeatureBanner.tsx`

## How to Use

### Add to Any Page

Import and use the component in your Remix route files:

```tsx
import FeatureBanner from "~/components/sections/FeatureBanner";

export default function YourPage() {
  return (
    <div>
      <FeatureBanner
        eyebrowText="Spring Collection 2026"
        heading="Style Meets Sustainability"
        description="Discover our eco-friendly fashion line crafted with care."
        ctaText="Shop Now"
        ctaUrl="/products"
        ctaBgColor="#2d6a4f"
        ctaTextColor="#ffffff"
        bgColorStart="#d8f3dc"
        bgColorEnd="#b7e4c7"
      />
    </div>
  );
}
```

### Currently Used On

✅ **Homepage** (`app/routes/_index.tsx`) - Displays below the Hero section

## Component Props

### Content Props
- `eyebrowText` (string) - Small label above heading (default: "New Arrival")
- `heading` (string) - Main headline (default: "Discover Our Latest Collection")
- `description` (string) - Supporting text
- `ctaText` (string) - Button text (default: "Shop Now")
- `ctaUrl` (string) - Button link (default: "/products")

### Styling Props
- `ctaBgColor` (string) - Button background color (default: "#000000")
- `ctaTextColor` (string) - Button text color (default: "#FFFFFF")
- `buttonRadius` (number) - Button corner radius in px (default: 8)
- `bgColorStart` (string) - Gradient start color (default: "#f8f9fa")
- `bgColorEnd` (string) - Gradient end color (default: "#e9ecef")
- `bgImage` (string) - Background image URL (optional)
- `imageOpacity` (number) - Background image opacity 0-1 (default: 0.3)

### Typography Props
- `headingSize` (number) - Heading font size in px (default: 48)
- `headingColor` (string) - Heading text color (default: "#1a1a1a")
- `eyebrowColor` (string) - Eyebrow text color (default: "#6c757d")
- `descriptionSize` (number) - Description font size in px (default: 18)
- `textColor` (string) - Description text color (default: "#495057")

### Layout Props
- `textAlignment` ('left' | 'center' | 'right') - Text alignment (default: "center")
- `contentWidth` (number) - Maximum content width in px (default: 1000)
- `paddingTop` (number) - Top padding in px (default: 80)
- `paddingBottom` (number) - Bottom padding in px (default: 80)
- `paddingSides` (number) - Side padding in px (default: 40)

## Design Examples

### Example 1: Hero Banner (Currently on Homepage)
```tsx
<FeatureBanner
  eyebrowText="Spring Collection 2026"
  heading="Style Meets Sustainability"
  description="Discover our eco-friendly fashion line crafted with care for both you and the planet."
  ctaText="Shop Spring Collection"
  ctaUrl="/collections/spring-2026"
  ctaBgColor="#2d6a4f"
  ctaTextColor="#ffffff"
  buttonRadius={8}
  bgColorStart="#d8f3dc"
  bgColorEnd="#b7e4c7"
  headingSize={56}
  headingColor="#1b4332"
  eyebrowColor="#52b788"
  textColor="#2d6a4f"
  paddingTop={100}
  paddingBottom={100}
/>
```

### Example 2: Promotional Banner
```tsx
<FeatureBanner
  eyebrowText="Limited Time Offer"
  heading="Get 25% Off Summer Styles"
  description="Use code SUMMER25 at checkout"
  ctaText="Shop Sale"
  ctaUrl="/collections/sale"
  ctaBgColor="#ff6b6b"
  bgColorStart="#ffe5e5"
  bgColorEnd="#ffd4d4"
  paddingTop={60}
  paddingBottom={60}
/>
```

### Example 3: Collection Showcase
```tsx
<FeatureBanner
  heading="New Denim Collection"
  description="Classic cuts, modern comfort"
  ctaText="Explore Collection"
  ctaUrl="/collections/denim"
  bgImage="https://your-image-url.jpg"
  imageOpacity={0.4}
  bgColorStart="#212529"
  bgColorEnd="#495057"
  headingColor="#ffffff"
  textColor="#f8f9fa"
  textAlignment="left"
/>
```

## Best Practices

1. **Color Contrast:** Ensure text colors have good contrast against the background
2. **Mobile Optimization:** The component automatically scales heading and description on mobile
3. **Image Quality:** Use high-quality images (recommended: 2000px wide) for background images
4. **Content Length:** Keep descriptions concise (2-3 lines max) for best visual impact
5. **CTA Clarity:** Use action-oriented button text ("Shop Now", "Learn More", "Explore")
6. **Performance:** Optimize images before using them as backgrounds

## Features

✨ **Built-in Features:**
- Responsive design with automatic mobile scaling
- Smooth hover animations on CTA button
- Gradient backgrounds with optional image overlay
- Fully typed TypeScript component
- Customizable without touching code
- Accessible and semantic HTML

## Technical Details

- **Framework:** React/Remix
- **Styling:** Inline styles with responsive design
- **Type Safety:** Full TypeScript support
- **Performance:** Optimized with CSS transitions
- **Accessibility:** Semantic HTML structure

---

**Created:** March 27, 2026  
**Location:** `app/components/sections/FeatureBanner.tsx`
