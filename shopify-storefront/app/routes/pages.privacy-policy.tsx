/**
 * Privacy Policy Page
 */

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PAGE_BY_HANDLE_QUERY } from "~/lib/queries";

export const meta: MetaFunction = () => {
  return [
    { title: "Privacy Policy - Shopify Storefront" },
    { name: "description", content: "Our commitment to protecting your privacy" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const response = await storefrontFetch<{
      page: { id: string; title: string; body: string } | null;
    }>(GET_PAGE_BY_HANDLE_QUERY, {
      handle: "privacy-policy",
    });

    return json({ page: response.page });
  } catch (error) {
    console.error("Error fetching privacy policy page:", error);
    return json({ page: null });
  }
}

export default function PrivacyPolicyPage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {page?.title || "Privacy Policy"}
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p>
                At Evergreen Apparel Co ("we," "our," or "us"), we respect your privacy and are committed to
                protecting your personal information. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you visit our website and make purchases.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Personal Information</h3>
              <p>We collect information that you provide directly to us, including:</p>
              <ul>
                <li>Name and contact information (email, phone, address)</li>
                <li>Payment information (processed securely through payment providers)</li>
                <li>Account credentials (username, password)</li>
                <li>Purchase history and preferences</li>
                <li>Communication history with customer service</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Automatically Collected Information</h3>
              <ul>
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, clicks)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location information (with your permission)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p>We use the collected information for purposes including:</p>
              <ul>
                <li>Processing and fulfilling your orders</li>
                <li>Communicating with you about your orders and account</li>
                <li>Providing customer support</li>
                <li>Personalizing your shopping experience</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Improving our website and services</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sharing Your Information</h2>
              <p>We may share your information with:</p>
              <ul>
                <li><strong>Service Providers:</strong> Payment processors, shipping companies, email services</li>
                <li><strong>Business Partners:</strong> With your consent for joint offerings</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, sales, or acquisitions</li>
              </ul>
              <p className="mt-4">
                We do not sell your personal information to third parties for their marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Object:</strong> Object to certain processing of your information</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at privacy@storefront.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic,
                and personalize content. You can control cookies through your browser settings, but disabling
                cookies may limit some website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no internet
                transmission is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect
                personal information from children under 13. If you believe we have collected information from
                a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Users</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. These
                countries may have different data protection laws. By using our services, you consent to
                such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material
                changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices,
                please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mt-4 not-prose">
                <p className="text-gray-700"><strong>Email:</strong> privacy@storefront.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> 1-800-STOREFRONT</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Fashion Ave, New York, NY 10001</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
