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
  
  const isDimensionActive = (dimensionId: DimensionType) => {
    return currentDimension === dimensionId;
  };

  const isKeyActive = (keyId: KeyType) => {
    return currentKey === keyId;
  };

  const getKeysByDimension = (dimensionId: DimensionType) => {
    return Object.values(KEYS).filter(key => key.dimension === dimensionId);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          {/* Framework Logo */}
          <Link 
            href="/"
            className={`p-2 rounded-lg transition-colors ${
              isFrameworkPage ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            title="Framework"
          >
            <div className="w-8 h-8 relative">
              <Image
                src={MAIN_LOGO}
                alt="Framework"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300" />

          {/* All Dimension and Key Icons */}
          {Object.values(DIMENSIONS).map((dimension) => (
            <div key={dimension.id} className="flex items-center gap-1">
              {/* Dimension Icon */}
              <Link
                href={`/dimension/${dimension.id}`}
                className={`p-2 rounded-lg transition-colors ${
                  isDimensionActive(dimension.id) || getKeysByDimension(dimension.id).some(key => isKeyActive(key.id))
                    ? 'bg-gray-100' 
                    : 'hover:bg-gray-50'
                }`}
                title={dimension.name}
                style={{
                  backgroundColor: isDimensionActive(dimension.id) || getKeysByDimension(dimension.id).some(key => isKeyActive(key.id))
                    ? `${dimension.color}20`
                    : 'transparent'
                }}
              >
                <div className="w-6 h-6 relative">
                  <Image
                    src={dimension.icon}
                    alt={dimension.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>

              {/* Key Icons for this dimension */}
              {getKeysByDimension(dimension.id).map((key) => (
                <Link
                  key={key.id}
                  href={`/dimension/${key.dimension}/key/${key.id}`}
                  className={`p-1.5 rounded transition-colors ${
                    isKeyActive(key.id)
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                  title={key.name}
                  style={{
                    backgroundColor: isKeyActive(key.id)
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
              ))}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}