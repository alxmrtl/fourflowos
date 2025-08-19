'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TopBar from '@/components/navigation/TopBar';
import { getContentById, getContentByDimension } from '@/data/content';
import { ContentItem } from '@/types/framework';
import { DIMENSIONS, KEYS, MAIN_LOGO } from '@/data/framework';

interface ContentPageProps {
  contentId: string;
}

export default function ContentPage({ contentId }: ContentPageProps) {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = () => {
      try {
        const contentItem = getContentById(contentId);
        setContent(contentItem);
        
        if (contentItem) {
          // Get related articles from the same dimension, excluding current article
          const dimensionContent = getContentByDimension(contentItem.dimension);
          const related = dimensionContent
            .filter(item => item.id !== contentItem.id)
            .slice(0, 3); // Limit to 3 related articles
          setRelatedArticles(related);
        }
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
  const keyData = KEYS[content.key];
  const estimatedTime = content.read_time || content.estimated_duration || 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-2 lg:px-8 py-3">
          <nav className="flex items-center space-x-3">
            <Link 
              href="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
              title="FourFlowOS Home"
            >
              <div className="relative w-8 h-8">
                <Image
                  src={MAIN_LOGO}
                  alt="FourFlowOS"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            
            <span className="text-gray-400 text-lg">→</span>
            
            <Link 
              href={`/dimension/${content.dimension}`}
              className="flex items-center hover:opacity-80 transition-opacity"
              title={`${dimensionData.name} Dimension`}
            >
              <div className="relative w-7 h-7">
                <Image
                  src={dimensionData.sectionLogo}
                  alt={dimensionData.name}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            
            <span className="text-gray-400 text-lg">→</span>
            
            <Link 
              href={`/dimension/${content.dimension}/key/${content.key}`}
              className="flex items-center hover:opacity-80 transition-opacity"
              title={keyData.name}
            >
              <div className="relative w-6 h-6">
                <Image
                  src={keyData.icon}
                  alt={keyData.name}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            
            <span className="text-gray-400 text-lg">→</span>
            
            <span className="text-gray-700 font-medium text-sm truncate max-w-xs">
              {content.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Content Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-2 lg:px-8 py-4 lg:py-6">
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
        <article className="max-w-none">
          <div 
            className="content-typography"
            dangerouslySetInnerHTML={{ 
              __html: formatMarkdownContent(content.content) 
            }} 
          />
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Related Flow Keys</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((article) => {
                const articleDimension = DIMENSIONS[article.dimension];
                const articleKey = KEYS[article.key];
                
                return (
                  <Link
                    key={article.id}
                    href={`/content/${article.id}`}
                    className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                          src={articleKey.icon}
                          alt={articleKey.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors text-sm leading-tight">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span 
                            className="text-xs px-2 py-1 rounded font-medium"
                            style={{ 
                              backgroundColor: `${articleDimension.color}20`,
                              color: articleDimension.color 
                            }}
                          >
                            {articleDimension.name}
                          </span>
                          {article.read_time && (
                            <span className="text-xs text-gray-500">
                              {article.read_time} min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link 
              href={`/dimension/${content.dimension}/key/${content.key}`}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {keyData.name} content
            </Link>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {content.read_time && (
                <span>{content.read_time} min read</span>
              )}
              {content.difficulty && (
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {content.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format markdown content for display
function formatMarkdownContent(content: string): string {
  // Enhanced markdown to HTML conversion with better formatting
  let html = content
    // Convert headers with proper spacing and styling
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4 leading-tight">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-12 mb-6 leading-tight">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-16 mb-8 leading-tight">$1</h1>')
    
    // Convert bold with better styling
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    
    // Convert italic
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
    
    // Convert inline code
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
    
    // Convert bullet points
    .replace(/^- (.*$)/gim, '<li class="text-gray-800 leading-relaxed">$1</li>')
    
    // Convert numbered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="text-gray-800 leading-relaxed">$1</li>')
    
    // Split into paragraphs and format
    .split('\n\n')
    .map(paragraph => {
      const trimmed = paragraph.trim();
      if (!trimmed) return '';
      
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li>')) {
        return trimmed;
      }
      
      // Regular paragraph
      return `<p class="text-gray-800 leading-relaxed mb-6 text-base">${trimmed}</p>`;
    })
    .join('\n');

  // Wrap consecutive <li> elements in styled lists
  html = html.replace(/(<li[^>]*>.*?<\/li>\s*)+/g, (match) => {
    return `<ul class="list-disc list-inside space-y-2 mb-6 ml-4">${match}</ul>`;
  });

  return html;
}