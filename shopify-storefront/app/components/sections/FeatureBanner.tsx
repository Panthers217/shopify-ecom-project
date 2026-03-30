/**
 * Feature Banner Component
 * An elegant, customizable banner for highlighting promotions, collections, or announcements
 */

interface FeatureBannerProps {
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

export default function FeatureBanner({
  eyebrowText = "New Arrival",
  heading = "Discover Our Latest Collection",
  description = "Experience premium quality and timeless style with our carefully curated selection.",
  ctaText = "Shop Now",
  ctaUrl = "/products",
  ctaBgColor = "#000000",
  ctaTextColor = "#FFFFFF",
  buttonRadius = 8,
  bgImage,
  imageOpacity = 0.3,
  bgColorStart = "#f8f9fa",
  bgColorEnd = "#e9ecef",
  headingSize = 48,
  headingColor = "#1a1a1a",
  eyebrowColor = "#6c757d",
  descriptionSize = 18,
  textColor = "#495057",
  textAlignment = "center",
  contentWidth = 1000,
  paddingTop = 80,
  paddingBottom = 80,
  paddingSides = 40,
}: FeatureBannerProps) {
  return (
    <section
      className="feature-banner relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${bgColorStart} 0%, ${bgColorEnd} 100%)`,
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingSides}px`,
        paddingRight: `${paddingSides}px`,
        textAlign: textAlignment,
        minHeight: '200px',
      }}
    >
      {/* Background Image */}
      {bgImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: imageOpacity,
            zIndex: 0,
          }}
        />
      )}

      {/* Content */}
      <div
        className="relative z-10 mx-auto"
        style={{ maxWidth: `${contentWidth}px` }}
      >
        {/* Eyebrow Text */}
        {eyebrowText && (
          <p
            className="font-semibold tracking-wider uppercase mb-4 opacity-90"
            style={{
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              color: eyebrowColor,
            }}
          >
            {eyebrowText}
          </p>
        )}

        {/* Heading */}
        {heading && (
          <h2
            className="font-bold mb-6 leading-tight"
            style={{
              fontSize: `${headingSize}px`,
              color: headingColor,
            }}
          >
            {heading}
          </h2>
        )}

        {/* Description */}
        {description && (
          <div
            className="mx-auto mb-8 leading-relaxed"
            style={{
              fontSize: `${descriptionSize}px`,
              color: textColor,
              maxWidth: '800px',
            }}
          >
            <p>{description}</p>
          </div>
        )}

        {/* Call to Action Button */}
        {ctaText && ctaUrl && (
          <a
            href={ctaUrl}
            className="inline-block px-10 py-4 font-semibold transition-all duration-300 ease-in-out hover:transform hover:-translate-y-0.5"
            style={{
              backgroundColor: ctaBgColor,
              color: ctaTextColor,
              borderRadius: `${buttonRadius}px`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            {ctaText}
          </a>
        )}
      </div>

      {/* Mobile Responsive Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .feature-banner h2 {
              font-size: ${headingSize * 0.7}px !important;
            }
            .feature-banner div p {
              font-size: ${descriptionSize * 0.9}px !important;
            }
          }
        `
      }} />
    </section>
  );
}
