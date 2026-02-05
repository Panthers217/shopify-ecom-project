shopify-storefront/
├─ .devcontainer/
│  └─ devcontainer.json
├─ .env.example
├─ package.json
├─ remix.config.js
├─ app/
│  ├─ entry.client.tsx
│  ├─ entry.server.tsx
│  ├─ root.tsx
│  ├─ routes/
│  │  ├─ _index.tsx                    # Home (New Merch + Cards)
│  │  ├─ products._index.tsx           # /products (Search + Filter + Cards)
│  │  ├─ products.$handle.tsx          # Product detail (Sizes/Color/Cart add)
│  │  ├─ collections.$handle.tsx       # Apparel/Accessories/Jewelry/Shoes/Sale/etc.
│  │  ├─ search.tsx                    # Search page (Search + Filter)
│  │  ├─ cart.tsx                      # Cart page
│  │  ├─ checkout.tsx                  # Checkout page/redirect
│  │  ├─ account.login.tsx             # Login
│  │  └─ account.signup.tsx            # Signup
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ Header.tsx
│  │  │  ├─ Footer.tsx
│  │  │  ├─ NavBar.tsx
│  │  │  └─ HoverBannerMenu.tsx        # banner shown on hover over nav menus
│  │  ├─ catalog/
│  │  │  ├─ Cards.tsx
│  │  │  ├─ CardOverview.tsx
│  │  │  ├─ NewMerch.tsx
│  │  │  ├─ Filter.tsx                 # colors, price, size, categories
│  │  │  ├─ Sizes.tsx
│  │  │  └─ Color.tsx
│  │  ├─ commerce/
│  │  │  ├─ Cart.tsx
│  │  │  ├─ Checkout.tsx
│  │  │  └─ CartIcon.tsx (optional)
│  │  ├─ auth/
│  │  │  ├─ Login.tsx
│  │  │  └─ Signup.tsx
│  │  └─ sections/
│  │     ├─ Apparel.tsx
│  │     ├─ Accessories.tsx
│  │     ├─ Jewelry.tsx
│  │     ├─ Shoes.tsx
│  │     ├─ Sale.tsx
│  │     ├─ Women.tsx
│  │     ├─ Men.tsx
│  │     ├─ Kids.tsx
│  │     └─ Bestseller.tsx
│  ├─ lib/
│  │  ├─ shopifyStorefront.server.ts   # Storefront API client
│  │  ├─ queries.ts                    # GraphQL queries/fragments
│  │  ├─ productMapper.ts              # map Storefront API -> your product template
│  │  ├─ money.ts                      # cents <-> formatted money helpers
│  │  └─ filters.ts                    # normalize filter params
│  └─ styles/
│     └─ app.css
└─ README.md
