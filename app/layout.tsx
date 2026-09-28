import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OpsAgent by CRESCONIX — AI Employee for Small Businesses",
    template: "%s | OpsAgent"
  },
  description:
    "OpsAgent is your AI employee that handles lead follow-up, invoicing, appointment reminders, and customer re-engagement automatically. Run your business on autopilot.",
  keywords: ["AI assistant", "small business", "lead management", "invoicing", "appointment reminders", "SaaS"],
  authors: [{ name: "CRESCONIX" }],
  creator: "CRESCONIX",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "OpsAgent by CRESCONIX",
    description: "Your AI employee for small business operations",
    siteName: "OpsAgent",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpsAgent by CRESCONIX",
    description: "Your AI employee for small business operations",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0E1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
