/**
 * Terms of Service Page
 */

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PAGE_BY_HANDLE_QUERY } from "~/lib/queries";

export const meta: MetaFunction = () => {
  return [
    { title: "Terms of Service - Shopify Storefront" },
    { name: "description", content: "Terms and conditions for using our services" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const response = await storefrontFetch<{
      page: { id: string; title: string; body: string } | null;
    }>(GET_PAGE_BY_HANDLE_QUERY, {
      handle: "terms-of-service",
    });

    return json({ page: response.page });
  } catch (error) {
    console.error("Error fetching terms of service page:", error);
    return json({ page: null });
  }
}

export default function TermsOfServicePage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {page?.title || "Terms of Service"}
        </h1>
        <p className="text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        {page?.body ? (
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        ) : (
          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
              <p>
                By accessing or using Evergreen Apparel Co's website and services ("Services"), you agree
                to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms,
                please do not use our Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use of Services</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Eligibility</h3>
              <p>
                You must be at least 18 years old to use our Services. By using our Services, you
                represent that you meet this age requirement and have the legal capacity to enter
                into these Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Account Registration</h3>
              <ul>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Prohibited Activities</h3>
              <p>You agree not to:</p>
              <ul>
                <li>Use our Services for any illegal purpose or in violation of any laws</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Interfere with or disrupt the Services or servers</li>
                <li>Attempt to gain unauthorized access to any portion of the Services</li>
                <li>Use automated systems (bots, scrapers) without permission</li>
                <li>Engage in any activity that could harm our reputation or business</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Orders and Payments</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Product Information</h3>
              <p>
                We strive to display product information accurately, including descriptions, pricing,
                and availability. However, we do not warrant that product descriptions or other content
                is accurate, complete, or error-free.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Pricing</h3>
              <ul>
                <li>All prices are in USD unless otherwise stated</li>
                <li>Prices are subject to change without notice</li>
                <li>We reserve the right to correct pricing errors</li>
                <li>Promotional pricing is valid for specified periods only</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Order Acceptance</h3>
              <p>
                We reserve the right to refuse or cancel any order for any reason, including but not
                limited to product availability, errors in pricing or product information, or suspected
                fraudulent or unauthorized transactions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Payment Terms</h3>
              <ul>
                <li>Payment must be received before order processing</li>
                <li>We accept major credit cards, debit cards, and other specified payment methods</li>
                <li>You represent that you have the legal right to use any payment method provided</li>
                <li>All payments are processed securely through third-party payment processors</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping and Delivery</h2>
              <p>
                Shipping times are estimates only and may vary. We are not responsible for delays
                caused by shipping carriers, customs, or circumstances beyond our control. Risk of
                loss passes to you upon delivery to the carrier.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Returns and Refunds</h2>
              <p>
                Our return policy is detailed on our Shipping & Returns page. By making a purchase,
                you agree to our return policy as stated. Refunds are processed according to the
                original payment method and may take 5-10 business days to appear.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <p>
                All content on our website, including text, graphics, logos, images, and software,
                is the property of Evergreen Apparel Co or its licensors and is protected by
                copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mt-4">
                You may not reproduce, distribute, modify, create derivative works of, publicly display,
                or exploit any content without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Content</h2>
              <p>
                If you submit content (reviews, comments, photos), you grant us a non-exclusive,
                royalty-free, perpetual, worldwide license to use, reproduce, modify, and display
                such content in connection with our Services.
              </p>
              <p className="mt-4">
                You represent that you own or have the necessary rights to any content you submit
                and that it does not violate any third-party rights or applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimers</h2>
              <p>
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className="mt-4">
                We do not warrant that our Services will be uninterrupted, error-free, or free of
                viruses or other harmful components.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, EVERGREEN APPAREL CO SHALL NOT BE LIABLE FOR
                ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
                PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
              </p>
              <p className="mt-4">
                Our total liability to you for all claims arising from your use of our Services shall
                not exceed the amount you paid us in the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Evergreen Apparel Co and its officers, directors,
                employees, and agents from any claims, damages, losses, liabilities, and expenses
                (including legal fees) arising from your use of our Services or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Governing Law</h3>
              <p>
                These Terms are governed by the laws of the State of New York, without regard to
                its conflict of law provisions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Arbitration</h3>
              <p>
                Any dispute arising from these Terms or our Services shall be resolved through binding
                arbitration in accordance with the American Arbitration Association's rules, rather
                than in court. You waive your right to participate in a class action lawsuit or
                class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p>
                We may suspend or terminate your access to our Services at any time, with or without
                cause, with or without notice. Upon termination, your right to use the Services will
                immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective
                immediately upon posting. Your continued use of our Services after changes are posted
                constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Miscellaneous</h2>
              <ul>
                <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in effect</li>
                <li><strong>Waiver:</strong> Failure to enforce any provision does not constitute a waiver of future enforcement</li>
                <li><strong>Assignment:</strong> You may not assign these Terms; we may assign them without restriction</li>
                <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mt-4 not-prose">
                <p className="text-gray-700"><strong>Email:</strong> legal@storefront.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> 1-800-STOREFRONT</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Fashion Ave, New York, NY 10001</p>
              </div>
            </section>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8 not-prose">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> These Terms of Service are provided as a template. For actual commercial use,
                please consult with a qualified attorney to ensure compliance with applicable laws and regulations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
