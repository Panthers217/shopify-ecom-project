/**
 * Setup Script: Feature Banner Metaobject Definition
 * 
 * This script creates the metaobject definition in Shopify for feature banners.
 * Run this ONCE to set up the content structure in your Shopify store.
 * 
 * Usage:
 *   npx tsx scripts/setupFeatureBannerMetaobject.ts
 */

import { config } from 'dotenv';
config();

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   SHOPIFY_STORE_DOMAIN');
  console.error('   SHOPIFY_ADMIN_ACCESS_TOKEN');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

/**
 * Create Metaobject Definition
 */
const CREATE_METAOBJECT_DEFINITION_MUTATION = `
  mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
    metaobjectDefinitionCreate(definition: $definition) {
      metaobjectDefinition {
        id
        name
        type
        fieldDefinitions {
          key
          name
          type {
            name
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const featureBannerDefinition = {
  name: "Feature Banner",
  type: "feature_banner",
  description: "Customizable homepage feature banner with content, styling, and CTA options",
  fieldDefinitions: [
    {
      name: "Eyebrow Text",
      key: "eyebrow_text",
      type: "single_line_text_field",
      description: "Small text above the heading (e.g., 'Spring Collection 2026')",
      validations: []
    },
    {
      name: "Heading",
      key: "heading",
      type: "single_line_text_field",
      description: "Main banner headline",
      required: true,
      validations: []
    },
    {
      name: "Description",
      key: "description",
      type: "multi_line_text_field",
      description: "Supporting text below the heading",
      validations: []
    },
    {
      name: "CTA Text",
      key: "cta_text",
      type: "single_line_text_field",
      description: "Button text (e.g., 'Shop Now')",
      validations: []
    },
    {
      name: "CTA URL",
      key: "cta_url",
      type: "single_line_text_field",
      description: "Button link (e.g., '/collections/spring-2026')",
      validations: []
    },
    {
      name: "CTA Background Color",
      key: "cta_bg_color",
      type: "color",
      description: "Button background color",
      validations: []
    },
    {
      name: "CTA Text Color",
      key: "cta_text_color",
      type: "color",
      description: "Button text color",
      validations: []
    },
    {
      name: "Button Radius",
      key: "button_radius",
      type: "number_integer",
      description: "Button corner radius in pixels (0-50)",
      validations: [
        { name: "min", value: "0" },
        { name: "max", value: "50" }
      ]
    },
    {
      name: "Background Color Start",
      key: "bg_color_start",
      type: "color",
      description: "Gradient start color",
      validations: []
    },
    {
      name: "Background Color End",
      key: "bg_color_end",
      type: "color",
      description: "Gradient end color",
      validations: []
    },
    {
      name: "Background Image",
      key: "bg_image",
      type: "file_reference",
      description: "Optional background image (will overlay gradient)",
      validations: []
    },
    {
      name: "Image Opacity",
      key: "image_opacity",
      type: "number_decimal",
      description: "Background image opacity (0.0 - 1.0)",
      validations: [
        { name: "min", value: "0" },
        { name: "max", value: "1" }
      ]
    },
    {
      name: "Heading Size",
      key: "heading_size",
      type: "number_integer",
      description: "Heading font size in pixels (24-96)",
      validations: [
        { name: "min", value: "24" },
        { name: "max", value: "96" }
      ]
    },
    {
      name: "Heading Color",
      key: "heading_color",
      type: "color",
      description: "Heading text color",
      validations: []
    },
    {
      name: "Eyebrow Color",
      key: "eyebrow_color",
      type: "color",
      description: "Eyebrow text color",
      validations: []
    },
    {
      name: "Description Size",
      key: "description_size",
      type: "number_integer",
      description: "Description font size in pixels (14-32)",
      validations: [
        { name: "min", value: "14" },
        { name: "max", value: "32" }
      ]
    },
    {
      name: "Text Color",
      key: "text_color",
      type: "color",
      description: "Description text color",
      validations: []
    },
    {
      name: "Text Alignment",
      key: "text_alignment",
      type: "single_line_text_field",
      description: "Text alignment: left, center, or right",
      validations: []
    },
    {
      name: "Content Width",
      key: "content_width",
      type: "number_integer",
      description: "Maximum content width in pixels (600-1400)",
      validations: [
        { name: "min", value: "600" },
        { name: "max", value: "1400" }
      ]
    },
    {
      name: "Padding Top",
      key: "padding_top",
      type: "number_integer",
      description: "Top padding in pixels (0-200)",
      validations: [
        { name: "min", value: "0" },
        { name: "max", value: "200" }
      ]
    },
    {
      name: "Padding Bottom",
      key: "padding_bottom",
      type: "number_integer",
      description: "Bottom padding in pixels (0-200)",
      validations: [
        { name: "min", value: "0" },
        { name: "max", value: "200" }
      ]
    },
    {
      name: "Padding Sides",
      key: "padding_sides",
      type: "number_integer",
      description: "Side padding in pixels (0-100)",
      validations: [
        { name: "min", value: "0" },
        { name: "max", value: "100" }
      ]
    }
  ],
  access: {
    storefront: "PUBLIC_READ"
  }
};

async function createMetaobjectDefinition() {
  console.log('🚀 Creating Feature Banner metaobject definition...\n');

  try {
    const response = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: CREATE_METAOBJECT_DEFINITION_MUTATION,
        variables: {
          definition: featureBannerDefinition
        }
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL Errors:', JSON.stringify(result.errors, null, 2));
      return false;
    }

    const { metaobjectDefinition, userErrors } = result.data.metaobjectDefinitionCreate;

    if (userErrors && userErrors.length > 0) {
      console.error('❌ User Errors:', JSON.stringify(userErrors, null, 2));
      return false;
    }

    console.log('✅ Successfully created metaobject definition!');
    console.log(`   Name: ${metaobjectDefinition.name}`);
    console.log(`   Type: ${metaobjectDefinition.type}`);
    console.log(`   Fields: ${metaobjectDefinition.fieldDefinitions.length}`);
    console.log(`   ID: ${metaobjectDefinition.id}\n`);

    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Run the setup
createMetaobjectDefinition()
  .then((success) => {
    if (success) {
      console.log('✨ Setup complete!\n');
      console.log('Next steps:');
      console.log('1. Go to Shopify Admin > Content > Metaobjects');
      console.log('2. Click "Feature Banner" to create your first banner');
      console.log('3. Fill in the banner content and styling');
      console.log('4. Save the banner (note the handle, e.g., "spring-collection-2026")');
      console.log('5. Go to Settings > Custom data > Shop');
      console.log('6. Create a metafield: custom.active_homepage_banner (Metaobject reference to Feature Banner)');
      console.log('7. Select your banner in the dropdown\n');
    } else {
      console.log('❌ Setup failed. Please check the errors above.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
