import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "@/components/navigation/NavigationWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FourFlowOS - Awakening Flow States",
  description: "A holistic framework for achieving flow states through the integration of Self, Space, Story, and Spirit dimensions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 pb-32">
          {children}
        </div>
        <NavigationWrapper />
      </body>
    </html>
  );
}
