import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import Signup from "~/components/auth/Signup";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up - Shopify Storefront" },
    { name: "description", content: "Create a new account" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Check if user is already logged in
  const isLoggedIn = false;
  
  if (isLoggedIn) {
    return redirect("/");
  }
  
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  // TODO: Implement Shopify Customer API registration
  const errors: { 
    email?: string; 
    password?: string; 
    firstName?: string;
    lastName?: string;
    general?: string;
  } = {};

  if (!email) {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  if (!firstName) {
    errors.firstName = "First name is required";
  }

  if (!lastName) {
    errors.lastName = "Last name is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  // TODO: Create customer account
  return redirect("/account/login");
}

export default function SignupPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="container">
      <div className="auth-container">
        <h1>Create Account</h1>
        <Signup errors={actionData?.errors} />
      </div>
    </div>
  );
}
