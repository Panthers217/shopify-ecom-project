/**
 * Contact Us Page
 */

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PAGE_BY_HANDLE_QUERY } from "~/lib/queries";

export const meta: MetaFunction = () => {
  return [
    { title: "Contact Us - Shopify Storefront" },
    { name: "description", content: "Get in touch with us" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const response = await storefrontFetch<{
      page: { id: string; title: string; body: string } | null;
    }>(GET_PAGE_BY_HANDLE_QUERY, {
      handle: "contact-us",
    });

    return json({ page: response.page });
  } catch (error) {
    console.error("Error fetching contact page:", error);
    return json({ page: null });
  }
}

export default function ContactPage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {page?.title || "Contact Us"}
        </h1>

        {page?.body ? (
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        ) : (
          <div className="space-y-8">
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                We'd love to hear from you! Whether you have a question about our products,
                need assistance with an order, or just want to give us feedback, we're here to help.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Send us a message</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">support@storefront.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">1-800-STOREFRONT</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Hours</h3>
                      <p className="text-gray-600">Mon-Fri: 9am - 5pm EST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
