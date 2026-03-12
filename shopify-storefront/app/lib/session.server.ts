/**
 * Session Management for Customer Authentication
 * 
 * Handles storing and retrieving customer access tokens in secure HTTP-only cookies
 */

import { createCookieSessionStorage, redirect } from "@remix-run/node";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in environment variables");
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function createUserSession({
  request,
  customerAccessToken,
  redirectTo,
}: {
  request: Request;
  customerAccessToken: string;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set("customerAccessToken", customerAccessToken);
  
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
      }),
    },
  });
}

export async function getUserSession(request: Request) {
  const session = await getSession(request);
  return session.get("customerAccessToken");
}

export async function requireUserSession(request: Request) {
  const customerAccessToken = await getUserSession(request);
  
  if (!customerAccessToken) {
    throw redirect("/account/login");
  }
  
  return customerAccessToken;
}

export async function destroyUserSession(request: Request) {
  const session = await getSession(request);
  
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
