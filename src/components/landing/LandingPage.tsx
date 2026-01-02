'use client';

import LandingNav from './LandingNav';
import HeroSection from './HeroSection';
import FrameworkSection from './FrameworkSection';
import KeysSection from './KeysSection';
import AppsSection from './AppsSection';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <LandingNav />
      <HeroSection />
      <FrameworkSection />
      <KeysSection />
      <AppsSection />
      <Footer />
    </div>
  );
}
