'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DIMENSIONS, KEYS } from '@/data/framework';
import { DimensionType, KeyType } from '@/types/framework';

interface TopContextBarProps {
  currentDimension?: DimensionType;
  currentKey?: KeyType;
}

export default function TopContextBar({ currentDimension, currentKey }: TopContextBarProps) {

  const getKeyPath = (keyId: KeyType) => {
    const key = KEYS[keyId];
    return `/dimension/${key.dimension}/key/${keyId}`;
  };

  const isKeyActive = (keyId: KeyType) => {
    return currentKey === keyId;
  };

  const isDimensionActive = (dimensionId: DimensionType) => {
    return currentDimension === dimensionId;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-6">
          {Object.values(DIMENSIONS).map((dimension) => (
            <div key={dimension.id} className="space-y-2">
              {/* Dimension Header */}
              <div 
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  isDimensionActive(dimension.id) ? 'bg-gray-100' : ''
                }`}
                style={{ 
                  backgroundColor: isDimensionActive(dimension.id) 
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
                <span 
                  className="text-sm font-medium"
                  style={{ color: dimension.color }}
                >
                  {dimension.name}
                </span>
              </div>

              {/* Keys */}
              <div className="space-y-1 pl-2">
                {dimension.keys.map((key) => (
                  <Link
                    key={key.id}
                    href={getKeyPath(key.id)}
                    className={`flex items-center gap-2 p-1.5 rounded text-xs transition-colors ${
                      isKeyActive(key.id) 
                        ? 'bg-gray-100 font-medium' 
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="w-4 h-4 relative">
                      <Image
                        src={key.icon}
                        alt={key.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="truncate">{key.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}