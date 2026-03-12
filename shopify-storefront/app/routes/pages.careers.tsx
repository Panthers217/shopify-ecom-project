/**
 * Careers Page
 */

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PAGE_BY_HANDLE_QUERY } from "~/lib/queries";

export const meta: MetaFunction = () => {
  return [
    { title: "Careers - Shopify Storefront" },
    { name: "description", content: "Join our team and help shape the future of sustainable fashion" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const response = await storefrontFetch<{
      page: { id: string; title: string; body: string } | null;
    }>(GET_PAGE_BY_HANDLE_QUERY, {
      handle: "careers",
    });

    return json({ page: response.page });
  } catch (error) {
    console.error("Error fetching careers page:", error);
    return json({ page: null });
  }
}

export default function CareersPage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {page?.title || "Join Our Team"}
        </h1>

        {page?.body ? (
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        ) : (
          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <p className="text-xl text-gray-600 mb-6">
                We're always looking for passionate, creative individuals to join our growing team.
                Help us shape the future of sustainable fashion.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Work With Us?</h2>
              <div className="grid md:grid-cols-2 gap-6 not-prose mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                  <div className="text-2xl mb-2">💼</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Competitive Benefits</h3>
                  <p className="text-gray-600 text-sm">
                    Health insurance, 401(k) matching, generous PTO, and employee discounts.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <div className="text-2xl mb-2">🌍</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Remote-Friendly</h3>
                  <p className="text-gray-600 text-sm">
                    Flexible work arrangements with options for remote and hybrid positions.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
                  <p className="text-gray-600 text-sm">
                    Professional development budget, mentorship programs, and career advancement.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
                  <div className="text-2xl mb-2">🎨</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Creative Culture</h3>
                  <p className="text-gray-600 text-sm">
                    Collaborative environment that values innovation, diversity, and fresh ideas.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Open Positions</h2>
              
              <div className="space-y-4 not-prose">
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">Senior Product Designer</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Full-time</span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Lead design initiatives for our digital products. 5+ years experience in e-commerce design.
                  </p>
                  <div className="flex gap-2 text-sm text-gray-500">
                    <span>📍 Remote</span>
                    <span>•</span>
                    <span>💰 $90k-$120k</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">Full Stack Developer</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Full-time</span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Build and maintain our e-commerce platform. Experience with React, TypeScript, and Shopify.
                  </p>
                  <div className="flex gap-2 text-sm text-gray-500">
                    <span>📍 Remote</span>
                    <span>•</span>
                    <span>💰 $80k-$110k</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">Customer Success Manager</h3>
                    <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">Part-time</span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Ensure customer satisfaction and handle support inquiries. Excellent communication skills required.
                  </p>
                  <div className="flex gap-2 text-sm text-gray-500">
                    <span>📍 Hybrid</span>
                    <span>•</span>
                    <span>💰 $45k-$60k</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">Marketing Coordinator</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Full-time</span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Develop and execute marketing campaigns across social media and email channels.
                  </p>
                  <div className="flex gap-2 text-sm text-gray-500">
                    <span>📍 New York, NY</span>
                    <span>•</span>
                    <span>💰 $55k-$75k</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Application Process</h2>
              <ol className="space-y-3">
                <li><strong>1. Submit your application</strong> - Send your resume and cover letter to careers@storefront.com</li>
                <li><strong>2. Initial screening</strong> - Our team will review your application within 1-2 weeks</li>
                <li><strong>3. Interview rounds</strong> - Typically 2-3 rounds including technical/skills assessment</li>
                <li><strong>4. Offer</strong> - Successful candidates receive an offer within 5 business days</li>
              </ol>
            </section>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mt-8 not-prose">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Don't See Your Role?</h3>
              <p className="text-gray-700 mb-4">
                We're always interested in meeting talented individuals. Send us your resume and
                tell us what you'd like to do at <a href="mailto:careers@storefront.com" className="text-indigo-600 hover:underline">careers@storefront.com</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
