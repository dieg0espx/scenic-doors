import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scenic Doors | Premium Door Installation - Southern California",
  description:
    "Southern California's premier luxury door installer. Factory-certified folding glass walls, multi-slide systems & pivot doors. Free quotes. 25+ years experience.",
  keywords:
    "folding doors, sliding glass doors, pivot doors, glass walls, LaCantina doors, door installation, Southern California doors, luxury doors",
  openGraph: {
    title: "Scenic Doors | Premium Door Installation",
    description:
      "Where Exceptional Design Meets Uncompromising Quality. Crafting premium folding, sliding, and pivot door systems for Southern California.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
