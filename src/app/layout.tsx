import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "@/components/navigation/NavigationWrapper";
import PageTransition from "@/components/PageTransition";
import SwipeContainer from "@/components/SwipeContainer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AudienceProvider } from "@/context/AudienceContext";
import { AuthProvider } from "@/context/AuthContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "FourFlowOS - The Operating System for Flow States",
  description: "Stop forcing focus. Start aligning the four dimensions that create it naturally. FourFlow makes flow trainable — through Self, Space, Story, and Spirit.",
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
      <body className={`${cormorant.variable} ${dmSans.variable} font-sans`}>
        <AuthProvider>
          <AudienceProvider>
            <LayoutWrapper>
              <SwipeContainer>
                <PageTransition>
                  {children}
                </PageTransition>
              </SwipeContainer>
            </LayoutWrapper>
            <NavigationWrapper />
          </AudienceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
