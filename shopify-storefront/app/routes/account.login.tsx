import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import Login from "~/components/auth/Login";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { CUSTOMER_LOGIN_MUTATION } from "~/lib/queries";
import { createUserSession, getUserSession } from "~/lib/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Shopify Storefront" },
    { name: "description", content: "Login to your account" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Check if user is already logged in
  const customerAccessToken = await getUserSession(request);
  
  if (customerAccessToken) {
    return redirect("/account");
  }
  
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Basic validation
  const errors: { email?: string; password?: string; general?: string } = {};

  if (!email || typeof email !== "string") {
    errors.email = "Email is required";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  try {
    // Authenticate with Shopify
    const response = await storefrontFetch<{
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    }>(CUSTOMER_LOGIN_MUTATION, {
      input: {
        email,
        password,
      },
    });

    const { customerAccessToken, customerUserErrors } =
      response.customerAccessTokenCreate;

    // Check for errors
    if (customerUserErrors.length > 0) {
      const error = customerUserErrors[0];
      return json(
        {
          errors: {
            general:
              error.message || "Invalid email or password. Please try again.",
          },
        },
        { status: 400 }
      );
    }

    // Check if we got a token
    if (!customerAccessToken?.accessToken) {
      return json(
        {
          errors: {
            general: "Authentication failed. Please try again.",
          },
        },
        { status: 400 }
      );
    }

    // Create session and redirect
    return createUserSession({
      request,
      customerAccessToken: customerAccessToken.accessToken,
      redirectTo: "/account",
    });
  } catch (error) {
    console.error("Login error:", error);
    return json(
      {
        errors: {
          general: "An error occurred during login. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>
        <Login errors={actionData?.errors} />
      </div>
    </div>
  );
}
