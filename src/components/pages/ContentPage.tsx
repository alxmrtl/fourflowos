'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import TopBar from '@/components/navigation/TopBar';
import { getContentById, getContentByDimension } from '@/data/content';
import { ContentItem } from '@/types/framework';
import { DIMENSIONS, KEYS } from '@/data/framework';

interface ContentPageProps {
  contentId: string;
}

export default function ContentPage({ contentId }: ContentPageProps) {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const contentItem = await getContentById(contentId);
        setContent(contentItem);

        if (contentItem) {
          // Get related articles from the same dimension, excluding current article
          const dimensionContent = await getContentByDimension(contentItem.dimension);
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <TopBar />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Content Not Found</h1>
          <p className="text-gray-400 mb-6">The content you&apos;re looking for could not be found.</p>
          <Link
            href="/framework"
            className="text-[#7A4DA4] hover:text-[#9A6DC4] font-medium"
          >
            Back to Framework
          </Link>
        </div>
      </div>
    );
  }

  const dimensionData = DIMENSIONS[content.dimension];
  const keyData = KEYS[content.key];
  const estimatedTime = content.read_time || content.estimated_duration || 5;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      <TopBar />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#111111] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-2 lg:px-8 py-3">
          <nav className="flex items-center space-x-3 text-sm">
            <span className="text-gray-500">Framework</span>
            <span className="text-gray-600">/</span>
            <Link
              href={`/dimension/${content.dimension}`}
              className="text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              {dimensionData.name}
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href={`/dimension/${content.dimension}/key/${content.key}`}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {keyData.name}
            </Link>
          </nav>
        </div>
      </div>

      {/* Content Header */}
      <div className="bg-[#050505] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          <div className="flex items-start gap-4">
            <div
              className="w-1 h-24 rounded-full flex-shrink-0"
              style={{ backgroundColor: dimensionData.color }}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-white"
                  style={{ backgroundColor: dimensionData.color }}
                >
                  {content.type}
                </span>
                {content.difficulty && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300">
                    {content.difficulty}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300">
                  {estimatedTime} min
                </span>
                {content.scientific_backing && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#5B84B1]/20 text-[#7DA3C9]">
                    Science-backed
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                {content.title}
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed">
                {content.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="max-w-none">
          <PortableText
            value={content.content}
            components={{
              block: {
                h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-16 mb-8 leading-tight">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-12 mb-6 leading-tight">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold text-white mt-8 mb-4 leading-tight">{children}</h3>,
                normal: ({ children }) => <p className="text-gray-300 leading-relaxed mb-6 text-base">{children}</p>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-white/20 pl-6 italic text-gray-400 my-6">{children}</blockquote>
              },
              marks: {
                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                code: ({ children }) => <code className="bg-white/10 text-gray-200 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                link: ({ children, value }) => <a href={value.href} className="text-[#7A4DA4] hover:text-[#9A6DC4] underline">{children}</a>
              },
              list: {
                bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-6 ml-4">{children}</ul>,
                number: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-6 ml-4">{children}</ol>
              },
              listItem: {
                bullet: ({ children }) => <li className="text-gray-300 leading-relaxed">{children}</li>,
                number: ({ children }) => <li className="text-gray-300 leading-relaxed">{children}</li>
              }
            }}
          />
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Related Content</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((article) => {
                const articleDimension = DIMENSIONS[article.dimension];
                const articleKey = KEYS[article.key];

                return (
                  <Link
                    key={article.id}
                    href={`/content/${article.id}`}
                    className="block p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200 group"
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
                        <h4 className="font-medium text-white group-hover:text-gray-200 transition-colors text-sm leading-tight">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
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
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <Link
              href={`/dimension/${content.dimension}/key/${content.key}`}
              className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors group"
            >
              <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {keyData.name}
            </Link>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {content.read_time && (
                <span>{content.read_time} min read</span>
              )}
              {content.difficulty && (
                <span className="px-2 py-1 bg-white/10 rounded text-xs">
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
