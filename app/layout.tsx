import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "HENRY Platform - Heroes' Early Notification & Response Yesterday",
  description: "HENRY Platform - Powered by The Henry Protocol | Advanced predictive risk assessment and proactive veteran care management system",
  keywords: "veteran, VA, claims, service verification, Vet Profile, DD-214, PACT Act, toxic exposure, disability rating",
  authors: [{ name: "Michael Skinner" }],
  openGraph: {
    title: "HENRY Platform",
    description: "Heroes' Early Notification & Response Yesterday - Powered by The Henry Protocol",
    type: "website",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0b0d',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
