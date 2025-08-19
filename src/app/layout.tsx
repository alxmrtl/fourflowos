import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "@/components/navigation/NavigationWrapper";
import PageTransition from "@/components/PageTransition";
import SwipeContainer from "@/components/SwipeContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FourFlowOS - Awakening Flow States",
  description: "A holistic framework for achieving flow states through the integration of Self, Space, Story, and Spirit dimensions.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FourFlowOS",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 pb-40 safe-area-top no-scroll-bounce">
          <SwipeContainer>
            <PageTransition>
              {children}
            </PageTransition>
          </SwipeContainer>
        </div>
        <NavigationWrapper />
      </body>
    </html>
  );
}
