'use client';

import Image from 'next/image';
import Link from 'next/link';
import MenuButton from './MenuButton';
import TopBarUserButton from './TopBarUserButton';

export default function TopBar() {
  return (
    <header className="bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 lg:py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-all duration-200 active:scale-95 touch-manipulation">
          <div className="h-12 lg:h-14 relative flex items-center">
            <Image
              src="/assets/FourFlowOS - Banner.png"
              alt="FourFlowOS"
              height={56}
              width={220}
              className="object-contain"
            />
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <TopBarUserButton />
          <MenuButton />
        </div>
      </div>
    </header>
  );
}
