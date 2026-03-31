'use client';

import Link from 'next/link';
import Image from 'next/image';
import TopBarUserButton from '@/components/navigation/TopBarUserButton';

export default function LabNav() {
  return (
    <nav className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-5 h-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-6 h-6 flex-shrink-0">
            <Image
              src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
              alt="FourFlow"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-white/60 font-semibold text-sm tracking-wide hidden sm:block">
            FourFlow<span className="text-white/25">OS</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center">
          {[
            { href: '/framework', label: 'Framework' },
            { href: '/apps', label: 'Practice' },
            { href: '/together', label: 'Work Together' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors tracking-wider uppercase"
            >
              {label}
            </Link>
          ))}
        </div>

        <TopBarUserButton />
      </div>
    </nav>
  );
}
