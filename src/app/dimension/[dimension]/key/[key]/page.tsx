import { notFound } from 'next/navigation';
import KeyPage from '@/components/pages/KeyPage';
import { KEYS, DIMENSIONS } from '@/data/framework';
import { KeyType, DimensionType } from '@/types/framework';

interface KeyPageProps {
  params: Promise<{
    dimension: string;
    key: string;
  }>;
}

export default async function KeyRoute({ params }: KeyPageProps) {
  const { dimension, key } = await params;
  
  // Validate dimension and key
  if (!Object.keys(DIMENSIONS).includes(dimension) || !Object.keys(KEYS).includes(key)) {
    notFound();
  }

  const keyData = KEYS[key as KeyType];
  
  // Ensure the key belongs to the dimension
  if (keyData.dimension !== dimension) {
    notFound();
  }

  return <KeyPage keyId={key as KeyType} dimension={dimension as DimensionType} />;
}

export async function generateStaticParams() {
  const params: { dimension: string; key: string }[] = [];
  
  Object.values(KEYS).forEach((key) => {
    params.push({
      dimension: key.dimension,
      key: key.id,
    });
  });
  
  return params;
}