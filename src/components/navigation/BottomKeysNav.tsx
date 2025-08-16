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

  const getKeyDimension = (keyId: KeyType) => {
    const key = KEYS[keyId];
    return DIMENSIONS[key.dimension];
  };


  return (
    <div className="bg-gray-50 border-t border-b border-gray-200 shadow-sm">
      {/* Keys Navigation Row */}
      <div className="grid grid-cols-4 gap-0 px-2 py-2">
        {Object.values(DIMENSIONS).map((dimension) => (
          <div key={dimension.id} className="flex justify-center gap-0.5">
            {getKeysByDimension(dimension.id).map((key) => (
              <Link
                key={key.id}
                href={`/dimension/${key.dimension}/key/${key.id}`}
                className={`p-1 rounded transition-colors border ${
                  isKeyActive(key.id) || (isDimensionActive(key.dimension) && !currentKey)
                    ? 'bg-white border-gray-300'
                    : 'hover:bg-white border-transparent'
                }`}
                title={key.name}
                style={{
                  backgroundColor: isKeyActive(key.id) || (isDimensionActive(key.dimension) && !currentKey)
                    ? `${dimension.color}20`
                    : 'white'
                }}
              >
                <div className="w-4 h-4 relative">
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
  );
}