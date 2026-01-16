import { getAllContent } from '@/lib/sanity';
import BlogPageClient from '@/components/pages/BlogPage';

// Force dynamic rendering - no static caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Blog() {
  // Fetch content server-side
  const content = await getAllContent();

  return <BlogPageClient initialContent={content} />;
}
