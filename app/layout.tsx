import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZotPool",
  description: "Save Costs, Make Friends, Travel Together!",
};

// Generate multiple dots dynamically
function generateDots(count: number) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    const top = Math.random() * 100; // Random top position (0% to 100%)
    const left = Math.random() * 100; // Random left position (0% to 100%)
    const delay = Math.random() * 5; // Random animation delay (0s to 5s)
    const size = Math.random() * 10 + 5; // Random size (5px to 15px)
    dots.push(
      <div
        key={i}
        className="dot"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${delay}s`,
        }}
      ></div>
    );
  }
  return dots;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ margin: 0, padding: 0 }}
      >
        {/* ClerkProvider to handle authentication */}
        <ClerkProvider>
          {/* Floating dots background */}
          <div className="floating-dots">{generateDots(50)}</div>

          {/* Header Section */}
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#255799",
              padding: "10px 20px",
              position: "relative",
            }}
          >
            {/* Logo Link */}
            <Link href="/">
              <Image
                src="/anteater_logo.png"
                alt="Anteater Logo"
                width={80}
                height={80}
                style={{ cursor: "pointer" }}
                priority={true} // Optimize loading
              />
            </Link>
            {/* Title */}
            <h1
              style={{
                color: "#fecc07",
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              ZotPool
            </h1>
          </header>

          {/* Main Content */}
          <main style={{ padding: "20px" }}>{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
