/**
 * Our Story Page
 */

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PAGE_BY_HANDLE_QUERY } from "~/lib/queries";

export const meta: MetaFunction = () => {
  return [
    { title: "Our Story - Shopify Storefront" },
    { name: "description", content: "Learn about our journey and mission" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const response = await storefrontFetch<{
      page: { id: string; title: string; body: string } | null;
    }>(GET_PAGE_BY_HANDLE_QUERY, {
      handle: "our-story",
    });

    return json({ page: response.page });
  } catch (error) {
    console.error("Error fetching our story page:", error);
    return json({ page: null });
  }
}

export default function OurStoryPage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {page?.title || "Our Story"}
        </h1>

        {page?.body ? (
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        ) : (
          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <p className="text-xl text-gray-600 italic mb-6">
                "Quality, style, and sustainability in every stitch."
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Beginning</h2>
              <p>
                Founded in 2020, Evergreen Apparel Co began with a simple mission: to create
                timeless, quality clothing that doesn't compromise on style or sustainability.
                What started as a small workshop has grown into a beloved brand committed to
                ethical fashion and exceptional craftsmanship.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p>
                We believe that great fashion should be accessible, sustainable, and built to last.
                Every piece we create is designed with care, produced ethically, and made to become
                a staple in your wardrobe for years to come.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-6 not-prose">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="text-3xl mb-3">🌱</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
                  <p className="text-gray-600 text-sm">
                    We use eco-friendly materials and sustainable practices in every step of production.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
                  <p className="text-gray-600 text-sm">
                    Premium materials and meticulous craftsmanship ensure products that last.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
                  <div className="text-3xl mb-3">🤝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ethics</h3>
                  <p className="text-gray-600 text-sm">
                    Fair wages, safe working conditions, and transparent supply chains.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Looking Forward</h2>
              <p>
                As we continue to grow, our commitment remains unchanged: to provide you with
                exceptional products while making a positive impact on our planet and communities.
                Thank you for being part of our journey.
              </p>
            </section>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mt-8 not-prose">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Join Our Community</h3>
              <p className="text-gray-700 text-center mb-6">
                Follow us on social media to stay updated on new collections, behind-the-scenes
                content, and sustainability initiatives.
              </p>
              <div className="flex justify-center gap-4">
                <a href="#" className="text-2xl hover:scale-110 transition-transform">📘</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform">📷</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform">🐦</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform">📌</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
