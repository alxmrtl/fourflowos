'use client';

import Image from 'next/image';
import Link from 'next/link';
import MenuButton from './MenuButton';

export default function TopBar() {
  return (
    <header className="bg-[#333333] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 lg:py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-all duration-200 active:scale-95 touch-manipulation">
          <div className="h-16 lg:h-20 relative flex items-center">
            <Image
              src="/assets/FourFlowOS - Banner.png"
              alt="FourFlowOS"
              height={64}
              width={250}
              className="object-contain lg:scale-110"
            />
          </div>
        </Link>
        <MenuButton />
      </div>
    </header>
  );
}