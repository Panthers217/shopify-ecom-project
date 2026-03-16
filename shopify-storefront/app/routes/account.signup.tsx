import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import Signup from "~/components/auth/Signup";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { CUSTOMER_CREATE_MUTATION, CUSTOMER_LOGIN_MUTATION } from "~/lib/queries";
import { createUserSession, getUserSession } from "~/lib/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up - Shopify Storefront" },
    { name: "description", content: "Create a new account" },
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
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const acceptsMarketing = formData.get("acceptsMarketing") === "on";

  // Basic validation
  const errors: { 
    email?: string; 
    password?: string; 
    firstName?: string;
    lastName?: string;
    general?: string;
  } = {};

  if (!email || typeof email !== "string") {
    errors.email = "Email is required";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!firstName || typeof firstName !== "string") {
    errors.firstName = "First name is required";
  }

  if (!lastName || typeof lastName !== "string") {
    errors.lastName = "Last name is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  try {
    // Create customer account
    const createResponse = await storefrontFetch<{
      customerCreate: {
        customer: { id: string; email: string } | null;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    }>(CUSTOMER_CREATE_MUTATION, {
      input: {
        email,
        password,
        firstName,
        lastName,
        ...(acceptsMarketing && {
          emailMarketingConsent: {
            marketingOptInLevel: "SINGLE_OPT_IN",
            marketingState: "SUBSCRIBED",
          },
        }),
      },
    });

    const { customer, customerUserErrors } = createResponse.customerCreate;

    // Check for errors
    if (customerUserErrors.length > 0) {
      const error = customerUserErrors[0];
      
      // Map Shopify error codes to user-friendly messages
      let errorMessage = error.message;
      if (error.code === "TAKEN") {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === "TOO_SHORT") {
        errorMessage = "Password must be at least 8 characters.";
      }
      
      return json(
        {
          errors: {
            general: errorMessage,
          },
        },
        { status: 400 }
      );
    }

    // Check if account was created
    if (!customer) {
      return json(
        {
          errors: {
            general: "Failed to create account. Please try again.",
          },
        },
        { status: 400 }
      );
    }

    // Now log the user in automatically
    const loginResponse = await storefrontFetch<{
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

    const { customerAccessToken } = loginResponse.customerAccessTokenCreate;

    if (!customerAccessToken?.accessToken) {
      // Account created but auto-login failed, redirect to login page
      return redirect("/account/login?message=Account created! Please log in.");
    }

    // Create session and redirect
    return createUserSession({
      request,
      customerAccessToken: customerAccessToken.accessToken,
      redirectTo: "/account",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return json(
      {
        errors: {
          general: "An error occurred during signup. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}

export default function SignupPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start shopping today</p>
        </div>
        <Signup errors={actionData?.errors} />
      </div>
    </div>
  );
}
