'use client';

import Image from 'next/image';
import MenuButton from './MenuButton';

export default function TopBar() {
  return (
    <header className="bg-[#333333] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-12 relative">
            <Image
              src="/assets/FourFlowOS - Banner.png"
              alt="FourFlowOS"
              height={48}
              width={200}
              className="object-contain"
            />
          </div>
        </div>
        <MenuButton />
      </div>
    </header>
  );
}