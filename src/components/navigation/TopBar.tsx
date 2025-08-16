'use client';

import Image from 'next/image';
import Link from 'next/link';
import MenuButton from './MenuButton';

export default function TopBar() {
  return (
    <header className="bg-[#333333] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <div className="h-16 relative flex items-center">
            <Image
              src="/assets/FourFlowOS - Banner.png"
              alt="FourFlowOS"
              height={64}
              width={250}
              className="object-contain"
            />
          </div>
        </Link>
        <MenuButton />
      </div>
    </header>
  );
}