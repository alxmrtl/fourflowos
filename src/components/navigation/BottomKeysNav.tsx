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

  // Debug: Check if we have keys
  console.log('KEYS:', Object.keys(KEYS).length, 'keys found');
  console.log('DIMENSIONS:', Object.keys(DIMENSIONS).length, 'dimensions found');

  return (
    <div className="bg-gray-50 border-t border-b border-gray-200 shadow-sm min-h-[60px]">
      {/* Keys Navigation Row */}
      <div className="grid grid-cols-4 gap-0 px-3 py-3">
        {Object.values(DIMENSIONS).map((dimension) => (
          <div key={dimension.id} className="flex justify-center gap-1">
            {getKeysByDimension(dimension.id).map((key) => (
              <Link
                key={key.id}
                href={`/dimension/${key.dimension}/key/${key.id}`}
                className={`p-1.5 rounded-lg transition-colors border ${
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
      
      {/* Debug info */}
      <div className="text-xs text-center text-gray-500 pb-1">
        Keys: {Object.keys(KEYS).length} | Dimensions: {Object.keys(DIMENSIONS).length}
      </div>
    </div>
  );
}