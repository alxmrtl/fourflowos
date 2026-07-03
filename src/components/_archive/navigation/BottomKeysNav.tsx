'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DIMENSIONS, KEYS } from '@/data/framework';
import { DimensionType, KeyType } from '@/types/framework';

interface BottomKeysNavProps {
  currentDimension?: DimensionType;
  currentKey?: KeyType;
}

export default function BottomKeysNav({ currentDimension, currentKey }: BottomKeysNavProps) {
  const isKeyActive = (keyId: KeyType) => {
    return currentKey === keyId;
  };

  const isDimensionActive = (dimensionId: DimensionType) => {
    return currentDimension === dimensionId;
  };

  const getKeysByDimension = (dimensionId: DimensionType) => {
    return Object.values(KEYS).filter(key => key.dimension === dimensionId);
  };

  return (
    <div className="bg-ground-lift border-t border-white/10">
      {/* Keys Navigation Row */}
      <div className="grid grid-cols-4 gap-0 px-2 py-3 lg:px-4 lg:py-4">
        {Object.values(DIMENSIONS).map((dimension) => (
          <div key={dimension.id} className="flex justify-center gap-1 lg:gap-2">
            {getKeysByDimension(dimension.id).map((key) => {
              const isActive = isKeyActive(key.id) || (isDimensionActive(key.dimension) && !currentKey);

              return (
                <Link
                  key={key.id}
                  href={`/dimension/${key.dimension}/key/${key.id}`}
                  className={`p-1.5 lg:p-2 rounded-lg transition-all duration-150 touch-manipulation active:scale-110 ${
                    isActive
                      ? 'bg-white/10 shadow-lg'
                      : 'hover:bg-white/5 active:bg-white/10'
                  }`}
                  title={key.name}
                  style={{
                    boxShadow: isActive ? `0 0 20px -5px ${dimension.color}40` : 'none',
                  }}
                >
                  <div className="w-5 h-5 lg:w-7 lg:h-7 relative transition-transform duration-100 group-active:scale-125">
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
        ))}
      </div>
    </div>
  );
}
