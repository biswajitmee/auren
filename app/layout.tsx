import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AUREN NOIR | Liquid Architecture",
  description: "A cinematic perfume campaign experience for AUREN NOIR.",
  openGraph: {
    title: "AUREN NOIR | Liquid Architecture",
    description: "Structure is the new seduction.",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
  themeColor: "#0A0806"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
