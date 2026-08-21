import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "ZotPool",
  description: "Real-time ride matching for the UCI community",
};

function generateDots(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const top = (index * 37) % 100;
    const left = (index * 61) % 100;
    const size = 5 + (index % 10);
    return (
      <div
        key={index}
        className="dot"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${index % 5}s`,
        }}
      />
    );
  });
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authEnabled = Boolean(
    process.env.NEXT_PUBLIC_ENABLE_AUTH === "true" &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY,
  );
  const app = (
    <>
      <div className="floating-dots">{generateDots(50)}</div>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#255799",
          padding: "10px 20px",
          position: "relative",
        }}
      >
        <Link href="/">
          <Image
            src="/anteater_logo.png"
            alt="ZotPool anteater logo"
            width={96}
            height={52}
          />
        </Link>
      </header>
      <main>{children}</main>
    </>
  );

  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{ margin: 0, padding: 0 }}
      >
        {authEnabled ? (
          <ClerkProvider>{app}</ClerkProvider>
        ) : (
          app
        )}
      </body>
    </html>
  );
}
