import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import Login from "~/components/auth/Login";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Shopify Storefront" },
    { name: "description", content: "Login to your account" },
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

  // TODO: Implement Shopify Customer API login
  const errors: { email?: string; password?: string; general?: string } = {};

  if (!email) {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  // TODO: Authenticate user and create session
  return redirect("/");
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="container">
      <div className="auth-container">
        <h1>Login</h1>
        <Login errors={actionData?.errors} />
      </div>
    </div>
  );
}
