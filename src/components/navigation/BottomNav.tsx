'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DIMENSIONS, MAIN_LOGO } from '@/data/framework';
import { DimensionType } from '@/types/framework';

export default function BottomNav() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const getDimensionPath = (dimension: DimensionType) => `/dimension/${dimension}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {/* Framework/Home Button */}
        <Link 
          href="/" 
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            isActive('/') ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
        >
          <div className="w-8 h-8 relative">
            <Image
              src={MAIN_LOGO}
              alt="FourFlow Framework"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xs mt-1 text-gray-600">Framework</span>
        </Link>

        {/* Dimension Buttons */}
        {Object.values(DIMENSIONS).map((dimension) => (
          <Link
            key={dimension.id}
            href={getDimensionPath(dimension.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive(getDimensionPath(dimension.id)) ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-8 h-8 relative">
              <Image
                src={dimension.icon}
                alt={dimension.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs mt-1 text-gray-600">{dimension.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}