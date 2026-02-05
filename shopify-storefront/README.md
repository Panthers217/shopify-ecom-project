# Shopify Storefront - Remix + TypeScript

A modern e-commerce storefront built with Remix, TypeScript, and the Shopify Storefront API. This project demonstrates full-stack development skills with a production-ready architecture.

## 🚀 Features

### Product Catalog
- **Product Browsing**: Browse all products with pagination
- **Product Details**: Detailed product pages with image galleries
- **Collections**: Browse products by collection (Apparel, Accessories, Jewelry, Shoes, etc.)
- **Search**: Full-text product search functionality
- **Filters**: Filter by color, size, price range, and categories

### Shopping Experience
- **Variant Selection**: Choose sizes and colors for products
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout**: Seamless checkout integration with Shopify

### User Features
- **Authentication**: Customer login and signup
- **Account Management**: User account pages
- **Responsive Design**: Mobile-first, responsive layout

### Developer Features
- **TypeScript**: Full type safety across the application
- **Server-Side Rendering**: Fast initial page loads with Remix
- **GraphQL Integration**: Efficient data fetching with Shopify Storefront API
- **Component Architecture**: Reusable, modular components
- **Dev Container**: Ready-to-use development environment

## 📁 Project Structure

```
shopify-storefront/
├── app/
│   ├── routes/                    # Remix routes
│   │   ├── _index.tsx            # Home page (New Arrivals)
│   │   ├── products._index.tsx   # All products
│   │   ├── products.$handle.tsx  # Product detail page
│   │   ├── collections.$handle.tsx # Collection pages
│   │   ├── search.tsx            # Search page
│   │   ├── cart.tsx              # Shopping cart
│   │   ├── checkout.tsx          # Checkout page
│   │   ├── account.login.tsx     # Customer login
│   │   └── account.signup.tsx    # Customer signup
│   │
│   ├── components/
│   │   ├── layout/               # Header, Footer, Navigation
│   │   ├── catalog/              # Product cards, filters, variant selectors
│   │   ├── commerce/             # Cart, checkout components
│   │   ├── auth/                 # Login, signup forms
│   │   └── sections/             # Collection sections
│   │
│   ├── lib/
│   │   ├── shopifyStorefront.server.ts  # Shopify API client
│   │   ├── queries.ts                   # GraphQL queries
│   │   ├── productMapper.ts             # Data transformation
│   │   ├── money.ts                     # Money formatting utilities
│   │   └── filters.ts                   # Product filtering logic
│   │
│   ├── styles/
│   │   └── app.css               # Global styles
│   │
│   ├── entry.client.tsx          # Client entry point
│   ├── entry.server.tsx          # Server entry point
│   └── root.tsx                  # Root component
│
├── public/                        # Static assets
├── .devcontainer/                 # Dev container configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
└── .env.example                   # Environment variables template
```

## 🛠️ Tech Stack

- **Framework**: [Remix](https://remix.run/) - Full-stack React framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **API**: [Shopify Storefront API](https://shopify.dev/api/storefront) - GraphQL API for storefronts
- **Styling**: CSS with CSS custom properties (variables)
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tooling

## 📋 Prerequisites

- Node.js 20.x or higher
- A Shopify store (for API credentials)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd shopify-storefront
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and add your Shopify credentials:

```bash
cp .env.example .env
```

#### Two Authentication Options:

**Option 1: Direct Storefront Access Token** (Simpler)
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

**Option 2: Client Credentials OAuth** (Custom Apps)
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_CLIENT_ID=shpca_your_client_id
SHOPIFY_CLIENT_SECRET=shpss_your_client_secret
```

📖 **For detailed setup instructions, see [SHOPIFY_SETUP.md](SHOPIFY_SETUP.md)**

#### Quick Setup:

1. Log in to your Shopify admin panel
2. Go to **Settings** → **Apps and sales channels** → **Develop apps**
3. Create or select your custom app
4. Go to **API credentials** tab
5. Copy your credentials to `.env` file
6. Configure **Storefront API** scopes if needed

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm run start
```

## 🧪 Development

### Project Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

### Code Organization

#### Routes (`app/routes/`)
- File-based routing powered by Remix
- Each route file exports `loader` (server-side data fetching) and default component
- Form submissions handled via `action` functions

#### Components (`app/components/`)
- **layout/**: Reusable layout components (Header, Footer, NavBar)
- **catalog/**: Product display components (Cards, Filters, Variant selectors)
- **commerce/**: Shopping cart and checkout components
- **auth/**: Authentication forms
- **sections/**: Collection-specific section components

#### Library (`app/lib/`)
- **shopifyStorefront.server.ts**: GraphQL client for Shopify Storefront API
- **queries.ts**: All GraphQL queries and mutations
- **productMapper.ts**: Transforms Shopify API responses to app data structure
- **money.ts**: Currency formatting and price calculations
- **filters.ts**: Product filtering and search logic

## 🎨 Customization

### Styling

Global styles are in `app/styles/app.css`. The project uses CSS custom properties for theming:

```css
:root {
  --color-primary: #000;
  --color-secondary: #fff;
  --color-accent: #333;
  /* ... more variables */
}
```

### Product Data Structure

Products follow the template defined in `/workspaces/shopify-ecom-project/PreliminaryProductStructure.md`. The `productMapper.ts` utility transforms Shopify API responses to this structure.

### Adding New Collections

1. Create a route in `app/routes/collections.$handle.tsx` (already exists)
2. Add collection links to navigation in `app/components/layout/NavBar.tsx`
3. Optionally create a section component in `app/components/sections/`

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SHOPIFY_STORE_DOMAIN` | Your Shopify store domain (e.g., `store.myshopify.com`) | Yes |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Direct Storefront API access token (Option 1) | * |
| `SHOPIFY_CLIENT_ID` | Custom app client ID for OAuth (Option 2) | * |
| `SHOPIFY_CLIENT_SECRET` | Custom app client secret for OAuth (Option 2) | * |
| `PUBLIC_STORE_URL` | Public URL of your Shopify store | No |

**\* Either provide `SHOPIFY_STOREFRONT_ACCESS_TOKEN` OR both `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET`**

## 📦 Component Reference

### Catalog Components

- **Cards**: Grid of product cards with images and pricing
- **CardOverview**: Detailed product view with image gallery
- **Filter**: Sidebar with color, size, price, and category filters
- **Sizes**: Size variant selector
- **Color**: Color variant selector
- **NewMerch**: New arrivals banner section

### Commerce Components

- **Cart**: Shopping cart with quantity controls
- **Checkout**: Checkout summary and redirect
- **CartIcon**: Shopping cart icon with item count

### Layout Components

- **Header**: Site header with logo and navigation
- **Footer**: Site footer with links and contact info
- **NavBar**: Main navigation menu
- **HoverBannerMenu**: Dropdown menu on navigation hover

### Section Components

- **Apparel**, **Accessories**, **Jewelry**, **Shoes**: Category sections
- **Women**, **Men**, **Kids**: Gender-based sections
- **Sale**: Sale items section
- **Bestseller**: Bestselling products section

## 🚢 Deployment

### Deploy to Remix Hosting Providers

This app can be deployed to any platform that supports Node.js:

- **Vercel**: `vercel deploy`
- **Netlify**: Deploy via Git integration
- **Fly.io**: `fly deploy`
- **Railway**: Connect repository for automatic deployments

### Build Configuration

The app uses Vite for building. Configuration is in `vite.config.ts`.

## 📝 License

This is a demonstration project for showcasing development skills.

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

## 📧 Contact

Built as a demonstration of Shopify storefront development skills using modern web technologies.

---

**Built with ❤️ using Remix, TypeScript, and Shopify Storefront API**
