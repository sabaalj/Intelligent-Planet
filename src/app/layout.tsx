import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "../styles/loginRegister.module.css";

/* ===== Fonts ===== */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/* ===== Metadata (replaces <head>) ===== */
export const metadata: Metadata = {
  title: "Intelligent Planet Hackathon 2026",
  description:
    "AI Solutions for an Intelligent Planet. Join the global innovation challenge at KFUPM in partnership with Google Cloud.",

  openGraph: {
    title: "Intelligent Planet Hackathon 2026",
    description:
      "AI Solutions for an Intelligent Planet. Join the global innovation challenge at KFUPM in partnership with Google Cloud.",
    type: "website",
    images: ["https://replit.com/public/images/opengraph.png"],
  },

  twitter: {
    card: "summary_large_image",
    site: "@replit",
    title: "Intelligent Planet Hackathon 2026",
    description:
      "AI Solutions for an Intelligent Planet. Join the global innovation challenge at KFUPM in partnership with Google Cloud.",
    images: ["https://replit.com/public/images/opengraph.png"],
  },

  icons: {
    icon: "/favicon.png",
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

/* ===== Root Layout ===== */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${inter.variable}
          ${spaceGrotesk.variable}
          antialiased
          dark
          overflow-x-hidden
        `}
      >
        {children}
      </body>
    </html>
  );
}
