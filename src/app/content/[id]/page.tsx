import ContentPage from '@/components/pages/ContentPage';

interface ContentPageProps {
  params: {
    id: string;
  };
}

export default function Content({ params }: ContentPageProps) {
  return <ContentPage contentId={params.id} />;
}

// Generate static params for all content items at build time
export async function generateStaticParams() {
  // Import here to avoid circular dependencies
  const { CONTENT_REPOSITORY } = await import('@/data/content');
  
  return CONTENT_REPOSITORY.map((item) => ({
    id: item.id,
  }));
}