import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return json({ error: "A valid email address is required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    // Submit to Netlify Forms.
    // Netlify intercepts this POST at the CDN level and stores the submission
    // in the dashboard under Forms > newsletter. No third-party service needed.
    const netlifyPayload = new URLSearchParams();
    netlifyPayload.append("form-name", "newsletter");
    netlifyPayload.append("email", email);

    // Netlify injects the site URL as process.env.URL in production.
    // Fall back to localhost when running locally (submissions won't be stored locally).
    const siteUrl = process.env.URL ?? "http://localhost:3000";

    const response = await fetch(`${siteUrl}/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: netlifyPayload.toString(),
    });

    if (!response.ok) {
      console.error("[Newsletter] Netlify Forms response:", response.status, await response.text());
      return json({ error: "Unable to subscribe. Please try again." }, { status: 500 });
    }

    return json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Newsletter] Submission error:", message);
    return json({ error: "An error occurred. Please try again." }, { status: 500 });
  }
}
