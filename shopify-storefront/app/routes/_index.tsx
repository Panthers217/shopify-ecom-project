import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Hero from "~/components/sections/Hero";
import FeatureBanner from "~/components/sections/FeatureBanner";
import NewMerch from "~/components/catalog/NewMerch";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PRODUCTS_QUERY, GET_SHOP_METAFIELDS_QUERY } from "~/lib/queries";
import { mapProducts } from "~/lib/productMapper";
import { extractBannerFromShopMetafield, DEFAULT_BANNER, type BannerData } from "~/lib/bannerMapper";

export const meta: MetaFunction = () => {
  return [
    { title: "Shopify Storefront - New Arrivals" },
    { name: "description", content: "Shop the latest arrivals and featured products" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Fetch latest products and banner data in parallel
    const [productsData, shopData] = await Promise.all([
      storefrontFetch<{
        products: { edges: Array<{ node: any }> };
      }>(GET_PRODUCTS_QUERY, {
        first: 8,
        sortKey: "CREATED_AT",
        reverse: true,
      }),
      storefrontFetch<any>(GET_SHOP_METAFIELDS_QUERY, {})
        .catch((error) => {
          console.error("Error fetching shop metafields:", error);
          return null;
        }),
    ]);

    const newProducts = mapProducts(productsData.products.edges);
    
    // Debug: Log the shop data response
    console.log('🔍 Shop data response:', JSON.stringify(shopData, null, 2));
    
    // Extract banner data from shop metafield (which references a metaobject)
    const bannerData: BannerData = shopData 
      ? extractBannerFromShopMetafield(shopData)
      : DEFAULT_BANNER;
    
    // Debug: Log the extracted banner data
    console.log('🎨 Banner data:', JSON.stringify(bannerData, null, 2));

    return json({ newProducts, bannerData });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return json({ newProducts: [], bannerData: DEFAULT_BANNER });
  }
}

export default function Index() {
  const { newProducts, bannerData } = useLoaderData<typeof loader>();

  return (
    <div>
      <Hero featuredProducts={newProducts.slice(0, 4)} />
      
      {/* Feature Banner - Dynamically loaded from Shopify metaobject */}
      <FeatureBanner {...bannerData} />
      
      <NewMerch
        products={newProducts}
        title="New Arrivals"
        description="Discover our latest collection of fashion-forward pieces"
      />
    </div>
  );
}
