import { notFound } from 'next/navigation';
import { getContentById, getContentByDimension, getAllContent } from '@/lib/sanity';
import ContentPageClient from '@/components/pages/ContentPage';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ContentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Content({ params }: ContentPageProps) {
  const { id } = await params;

  // Fetch content server-side
  const content = await getContentById(id);

  if (!content) {
    notFound();
  }

  // Get related articles from the same dimension
  const dimensionContent = await getContentByDimension(content.dimension);
  const relatedArticles = dimensionContent
    .filter(item => item.id !== content.id)
    .slice(0, 3);

  return (
    <ContentPageClient
      initialContent={content}
      initialRelatedArticles={relatedArticles}
    />
  );
}

// Generate static params for all content items at build time
export async function generateStaticParams() {
  const content = await getAllContent();
  return content.map((item) => ({
    id: item.id,
  }));
}
