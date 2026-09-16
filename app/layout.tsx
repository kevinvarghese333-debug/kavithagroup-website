import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Barlow, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://kavithagroup.in"),
  title: "Kavitha Group | Built on Trust",
  description:
    "Kavitha Group is a diversified enterprise spanning finance, jewellery, savings, fashion, events and leisure.",
  openGraph: {
    title: "Kavitha Group | Built on Trust",
    description: "One group. Many enterprises. A single promise—built on trust.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Kavitha Group — Built on Trust" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kavitha Group | Built on Trust",
    description: "One group. Many enterprises. A single promise—built on trust.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );

  return (
    <html lang="en">
      <body className={`${manrope.variable} ${barlow.variable} ${playfair.variable}`}>
        {authConfigured ? <ClerkProvider>{children}</ClerkProvider> : children}
      </body>
    </html>
  );
}
