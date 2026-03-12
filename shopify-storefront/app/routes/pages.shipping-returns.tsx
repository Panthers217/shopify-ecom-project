/**
 * Shipping & Returns Page
 */

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PAGE_BY_HANDLE_QUERY } from "~/lib/queries";

export const meta: MetaFunction = () => {
  return [
    { title: "Shipping & Returns - Shopify Storefront" },
    { name: "description", content: "Learn about our shipping and return policies" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const response = await storefrontFetch<{
      page: { id: string; title: string; body: string } | null;
    }>(GET_PAGE_BY_HANDLE_QUERY, {
      handle: "shipping-returns",
    });

    return json({ page: response.page });
  } catch (error) {
    console.error("Error fetching shipping returns page:", error);
    return json({ page: null });
  }
}

export default function ShippingReturnsPage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {page?.title || "Shipping & Returns"}
        </h1>

        {page?.body ? (
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        ) : (
          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <p>
                We offer fast, reliable shipping to ensure your order arrives safely and on time.
                All orders are processed within 1-2 business days.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Shipping Options</h3>
              <ul className="space-y-2">
                <li><strong>Standard Shipping (5-7 business days):</strong> $5.99</li>
                <li><strong>Express Shipping (2-3 business days):</strong> $12.99</li>
                <li><strong>Overnight Shipping (1 business day):</strong> $24.99</li>
                <li><strong>Free Shipping:</strong> On orders over $50</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">International Shipping</h3>
              <p>
                We currently ship to select international destinations. Shipping times and costs vary by location.
                Please allow 10-20 business days for international deliveries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Policy</h2>
              <p>
                Your satisfaction is our priority. If you're not completely happy with your purchase,
                we accept returns within 30 days of delivery.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Return Requirements</h3>
              <ul className="space-y-2">
                <li>Items must be unworn, unwashed, and in original condition</li>
                <li>All tags must be attached</li>
                <li>Original packaging should be included</li>
                <li>Proof of purchase required</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How to Return</h3>
              <ol className="space-y-2">
                <li>Contact our customer service team to initiate a return</li>
                <li>Pack your items securely in the original packaging</li>
                <li>Include your order number and reason for return</li>
                <li>Ship the package to the address provided</li>
                <li>Refund will be processed within 5-7 business days of receiving your return</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Non-Returnable Items</h3>
              <ul className="space-y-2">
                <li>Final sale items</li>
                <li>Gift cards</li>
                <li>Personalized or custom-made products</li>
                <li>Intimate apparel and swimwear (for hygiene reasons)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exchanges</h2>
              <p>
                We're happy to exchange items for a different size or color. Please contact our customer
                service team to arrange an exchange. Exchanges are subject to product availability.
              </p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-700">
                If you have questions about shipping or returns, please contact our customer service team
                at <a href="mailto:support@storefront.com" className="text-indigo-600 hover:underline">support@storefront.com</a> or
                call us at 1-800-STOREFRONT.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
