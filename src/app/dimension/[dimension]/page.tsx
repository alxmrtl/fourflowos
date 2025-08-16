import { notFound } from 'next/navigation';
import DimensionPage from '@/components/pages/DimensionPage';
import { DIMENSIONS } from '@/data/framework';
import { DimensionType } from '@/types/framework';

interface DimensionPageProps {
  params: Promise<{
    dimension: string;
  }>;
}

export default async function DimensionRoute({ params }: DimensionPageProps) {
  const { dimension } = await params;
  
  // Validate dimension
  if (!Object.keys(DIMENSIONS).includes(dimension)) {
    notFound();
  }

  return <DimensionPage dimension={dimension as DimensionType} />;
}

export async function generateStaticParams() {
  return Object.keys(DIMENSIONS).map((dimension) => ({
    dimension,
  }));
}