'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DIMENSIONS, KEYS, MAIN_LOGO } from '@/data/framework';
import { DimensionType, KeyType } from '@/types/framework';

interface TopIconBarProps {
  currentDimension?: DimensionType;
  currentKey?: KeyType;
}

export default function TopIconBar({ currentDimension, currentKey }: TopIconBarProps) {
  const pathname = usePathname();
  
  const isFrameworkPage = pathname === '/';

  const isKeyActive = (keyId: KeyType) => {
    return currentKey === keyId;
  };

  const isDimensionActive = (dimensionId: DimensionType) => {
    return currentDimension === dimensionId;
  };

  const getKeyDimension = (keyId: KeyType) => {
    const key = KEYS[keyId];
    return DIMENSIONS[key.dimension];
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-2 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-1 overflow-x-auto">
          {/* Framework Logo */}
          <Link 
            href="/"
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
              isFrameworkPage ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            title="Framework"
          >
            <div className="w-6 h-6 relative">
              <Image
                src={MAIN_LOGO}
                alt="Framework"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Separator */}
          <div className="w-px h-5 bg-gray-300 mx-1 flex-shrink-0" />

          {/* All Key Icons Only */}
          {Object.values(KEYS).map((key) => {
            const dimension = getKeyDimension(key.id);
            return (
              <Link
                key={key.id}
                href={`/dimension/${key.dimension}/key/${key.id}`}
                className={`p-1 rounded transition-colors flex-shrink-0 ${
                  isKeyActive(key.id) || (isDimensionActive(key.dimension) && !currentKey)
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
                title={key.name}
                style={{
                  backgroundColor: isKeyActive(key.id) || (isDimensionActive(key.dimension) && !currentKey)
                    ? `${dimension.color}20`
                    : 'transparent'
                }}
              >
                <div className="w-5 h-5 relative">
                  <Image
                    src={key.icon}
                    alt={key.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}