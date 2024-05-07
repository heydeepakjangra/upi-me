import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "UPI Payment Link Generator - Easy and Secure Online Payments for Everyone",
  description:
    "Generate UPI payment links in seconds with our easy-to-use tool. Enter your UPI ID, amount, and note (optional), and we'll create a link that you can share with anyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
