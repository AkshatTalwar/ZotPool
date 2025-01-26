import { clerkMiddleware } from "@clerk/nextjs/server";

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  throw new Error("Clerk keys are missing in the environment variables.");
}

export default clerkMiddleware();

export const config = {
  matcher: [
    // Exclude internal and static files
    "/((?!_next|_not-found|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always include API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};
