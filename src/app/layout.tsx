import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ColorfulNavbar from "@/components/ui/colorful-navbar";
import ColorfulFooter from "@/components/ui/colorful-footer";
import GoogleAnalytics from "@/components/google-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kevin Lin - Developer Portfolio",
  description: "Personal portfolio website showcasing my projects and skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white`}
      >
        <ColorfulNavbar />
        <main className="flex-grow pt-16">{children}</main>
        <ColorfulFooter />
      </body>
    </html>
  );
}
