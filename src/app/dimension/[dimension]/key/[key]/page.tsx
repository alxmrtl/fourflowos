import { notFound } from 'next/navigation';
import KeyPageClient from '@/components/pages/KeyPage';
import { KEYS, DIMENSIONS } from '@/data/framework';
import { KeyType, DimensionType } from '@/types/framework';
import { getContentByDimensionAndKey } from '@/lib/sanity';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  // Fetch content server-side
  const content = await getContentByDimensionAndKey(dimension, key);

  // Sort content: pinned first, then by date
  const sortedContent = content.sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    if (a.is_pinned && b.is_pinned) {
      return (a.pin_order || 0) - (b.pin_order || 0);
    }
    const aDate = new Date(a.created_date || '2024-01-01');
    const bDate = new Date(b.created_date || '2024-01-01');
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <KeyPageClient
      keyId={key as KeyType}
      dimension={dimension as DimensionType}
      initialContent={sortedContent}
    />
  );
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
