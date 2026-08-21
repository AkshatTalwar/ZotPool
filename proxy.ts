import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authConfigured = Boolean(
  process.env.NEXT_PUBLIC_ENABLE_AUTH === "true" &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY,
);
const authenticatedMiddleware = authConfigured ? clerkMiddleware() : null;

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  return authenticatedMiddleware
    ? authenticatedMiddleware(request, event)
    : NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|_not-found|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
