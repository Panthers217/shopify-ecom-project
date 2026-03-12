/**
 * Customer Account Page
 * Shows customer information and account options
 */

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { requireUserSession } from "~/lib/session.server";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_CUSTOMER_QUERY } from "~/lib/queries";

export const meta: MetaFunction = () => {
  return [
    { title: "My Account - Shopify Storefront" },
    { name: "description", content: "Manage your account and view orders" },
  ];
};

interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  defaultAddress: {
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    country: string;
    zip: string;
  } | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const customerAccessToken = await requireUserSession(request);

  try {
    const response = await storefrontFetch<{
      customer: Customer;
    }>(GET_CUSTOMER_QUERY, {
      customerAccessToken,
    });

    return json({ customer: response.customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw new Response("Failed to load customer data", { status: 500 });
  }
}

export default function AccountPage() {
  const { customer } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {customer.firstName || "Customer"}!
              </h1>
              <p className="text-gray-600">{customer.email}</p>
            </div>
            <Form method="post" action="/account/logout">
              <button
                type="submit"
                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Sign Out
              </button>
            </Form>
          </div>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="text-gray-900 font-medium">
                  {customer.firstName} {customer.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-gray-900 font-medium">{customer.email}</p>
              </div>
              {customer.phone && (
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="text-gray-900 font-medium">{customer.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Default Address */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Default Address
            </h2>
            {customer.defaultAddress ? (
              <div className="text-gray-900">
                <p>{customer.defaultAddress.address1}</p>
                {customer.defaultAddress.address2 && (
                  <p>{customer.defaultAddress.address2}</p>
                )}
                <p>
                  {customer.defaultAddress.city}, {customer.defaultAddress.province}{" "}
                  {customer.defaultAddress.zip}
                </p>
                <p>{customer.defaultAddress.country}</p>
              </div>
            ) : (
              <p className="text-gray-500">No default address set</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/account/orders"
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow group"
          >
            <div className="text-3xl mb-2">📦</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
              Order History
            </h3>
            <p className="text-sm text-gray-500 mt-1">View your past orders</p>
          </Link>
          
          <Link
            to="/account/addresses"
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow group"
          >
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
              Addresses
            </h3>
            <p className="text-sm text-gray-500 mt-1">Manage addresses</p>
          </Link>
          
          <Link
            to="/products"
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow group"
          >
            <div className="text-3xl mb-2">🛍️</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
              Continue Shopping
            </h3>
            <p className="text-sm text-gray-500 mt-1">Browse products</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
