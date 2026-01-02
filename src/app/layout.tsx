import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "@/components/navigation/NavigationWrapper";
import PageTransition from "@/components/PageTransition";
import SwipeContainer from "@/components/SwipeContainer";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FourFlowOS - The Operating System for Flow States",
  description: "Stop forcing focus. Start aligning the four dimensions that create it naturally. A holistic framework for achieving flow states through the integration of Self, Space, Story, and Spirit.",
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
  openGraph: {
    title: "FourFlowOS - The Operating System for Flow States",
    description: "Stop forcing focus. Start aligning the four dimensions that create it naturally.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>
          <SwipeContainer>
            <PageTransition>
              {children}
            </PageTransition>
          </SwipeContainer>
        </LayoutWrapper>
        <NavigationWrapper />
      </body>
    </html>
  );
}
