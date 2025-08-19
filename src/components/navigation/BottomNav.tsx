'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DIMENSIONS } from '@/data/framework';
import { DimensionType } from '@/types/framework';
import TouchRipple from '@/components/TouchRipple';

export default function BottomNav() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const getDimensionPath = (dimension: DimensionType) => `/dimension/${dimension}`;

  return (
    <nav className="bg-white border-t border-gray-200">
      <div className="grid grid-cols-4 gap-0 px-4 py-2">
        {/* Only Dimension Buttons */}
        {Object.values(DIMENSIONS).map((dimension) => (
          <TouchRipple 
            key={dimension.id}
            color={`${dimension.color}30`}
            className="rounded-lg"
          >
            <Link
              href={getDimensionPath(dimension.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 touch-manipulation active:scale-95 ${
                isActive(getDimensionPath(dimension.id)) ? 'bg-gray-100 shadow-sm' : 'hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
            <div className="w-8 h-8 relative mb-1 transition-transform duration-150 group-active:scale-110">
              <Image
                src={dimension.icon}
                alt={dimension.name}
                fill
                className="object-contain"
              />
            </div>
            <span 
              className="text-xs font-medium"
              style={{ color: dimension.color }}
            >
              {dimension.name}
            </span>
            </Link>
          </TouchRipple>
        ))}
      </div>
    </nav>
  );
}