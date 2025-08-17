'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/navigation/TopBar';
import { getContentById } from '@/data/content';
import { ContentItem } from '@/types/framework';
import { DIMENSIONS } from '@/data/framework';

interface ContentPageProps {
  contentId: string;
}

export default function ContentPage({ contentId }: ContentPageProps) {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = () => {
      try {
        const contentItem = getContentById(contentId);
        setContent(contentItem);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
          <p className="text-gray-600 mb-6">The content you&apos;re looking for could not be found.</p>
          <Link 
            href="/dimension"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Framework
          </Link>
        </div>
      </div>
    );
  }

  const dimensionData = DIMENSIONS[content.dimension];
  const estimatedTime = content.read_time || content.estimated_duration || 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/dimension" className="hover:text-gray-700">Framework</Link>
            <span>→</span>
            <Link 
              href={`/dimension/${content.dimension}`}
              className="hover:text-gray-700 capitalize"
            >
              {content.dimension}
            </Link>
            <span>→</span>
            <Link 
              href={`/dimension/${content.dimension}/key/${content.key}`}
              className="hover:text-gray-700"
            >
              {content.key.replace('-', ' ')}
            </Link>
            <span>→</span>
            <span className="text-gray-900">{content.type}</span>
          </nav>

          {/* Content Header */}
          <div className="flex items-start gap-4">
            <div 
              className="w-3 h-20 rounded-full flex-shrink-0"
              style={{ backgroundColor: dimensionData.color }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-white"
                  style={{ backgroundColor: dimensionData.color }}
                >
                  {content.type}
                </span>
                {content.difficulty && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {content.difficulty}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {estimatedTime} min
                </span>
                {content.scientific_backing && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Science-backed
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {content.title}
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                {content.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-lg max-w-none">
          <div 
            className="prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:my-1"
            dangerouslySetInnerHTML={{ 
              __html: formatMarkdownContent(content.content) 
            }} 
          />
        </article>

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {tag.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            href={`/dimension/${content.dimension}/key/${content.key}`}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to {content.key.replace('-', ' ')} content
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper function to format markdown content for display
function formatMarkdownContent(content: string): string {
  // Simple markdown to HTML conversion
  let html = content
    // Convert headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Convert bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Convert bullet points (simple approach)
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    
    // Convert numbered lists
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    
    // Convert paragraphs
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.trim().startsWith('<h') || paragraph.trim().startsWith('<li>')) {
        return paragraph;
      }
      return paragraph.trim() ? `<p>${paragraph.trim()}</p>` : '';
    })
    .join('\n');

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/(<li>.*?<\/li>\s*)+/g, (match) => {
    return `<ul>${match}</ul>`;
  });

  return html;
}