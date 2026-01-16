'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { DIMENSIONS } from '@/data/framework';
import { ContentItem, DimensionType } from '@/types/framework';
import PageLayout from '@/components/layout/PageLayout';

type FilterType = 'all' | DimensionType | 'learn' | 'practice';

export default function BlogPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const contentInView = useInView(contentRef, { once: true, margin: '-50px' });

  // Load content from API (server-side Sanity fetch to avoid CORS)
  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();
        if (data.success && data.content) {
          setAllContent(data.content);
        } else {
          console.error('Failed to load content:', data.error);
        }
      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const filteredContent = useMemo(() => {
    if (loading) return [];

    let content = allContent;

    // Apply dimension/type filter
    if (selectedFilter !== 'all') {
      if (['self', 'space', 'story', 'spirit'].includes(selectedFilter)) {
        content = allContent.filter(item => item.dimension === selectedFilter);
      } else if (['learn', 'practice'].includes(selectedFilter)) {
        content = allContent.filter(item => item.type === selectedFilter);
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      content = content.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return content;
  }, [selectedFilter, searchQuery, allContent, loading]);

  const getItemPath = (item: ContentItem) => {
    return `/content/${item.id}`;
  };

  const getFilterCount = (filter: FilterType) => {
    if (filter === 'all') return allContent.length;
    if (['self', 'space', 'story', 'spirit'].includes(filter)) {
      return allContent.filter(item => item.dimension === filter).length;
    }
    if (['learn', 'practice'].includes(filter)) {
      return allContent.filter(item => item.type === filter).length;
    }
    return 0;
  };

  const dimensionFilters = Object.values(DIMENSIONS);

  return (
    <PageLayout accentColor="#5B84B1">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-12 md:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10 md:mb-14">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-6">
                Content Library
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8 }}
            >
              Flow{' '}
              <span className="bg-gradient-to-r from-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
                Resources
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Explore learning materials and practices across all four dimensions.
              Filter by dimension, content type, or search for specific topics.
            </motion.p>
          </div>

          {/* Search and Filters */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <div
                className={`relative rounded-xl transition-all duration-300 ${
                  isSearchFocused
                    ? 'ring-2 ring-white/20 bg-white/[0.08]'
                    : 'bg-white/[0.05]'
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isSearchFocused ? 'text-white' : 'text-gray-500'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search articles, topics, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="block w-full pl-12 pr-4 py-4 bg-transparent border-0 text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {/* All Filter */}
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedFilter === 'all'
                    ? 'bg-white text-[#0a0a0a]'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                All ({getFilterCount('all')})
              </button>

              {/* Dimension Filters */}
              {dimensionFilters.map((dimension) => (
                <button
                  key={dimension.id}
                  onClick={() => setSelectedFilter(dimension.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedFilter === dimension.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white border border-white/10'
                  }`}
                  style={{
                    backgroundColor: selectedFilter === dimension.id
                      ? dimension.color
                      : 'rgba(255,255,255,0.05)',
                    borderColor: selectedFilter === dimension.id
                      ? dimension.color
                      : undefined,
                  }}
                >
                  {dimension.name} ({getFilterCount(dimension.id)})
                </button>
              ))}

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-white/10 mx-1" />

              {/* Content Type Filters */}
              <button
                onClick={() => setSelectedFilter('learn')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedFilter === 'learn'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                Learn ({getFilterCount('learn')})
              </button>
              <button
                onClick={() => setSelectedFilter('practice')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedFilter === 'practice'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                Practice ({getFilterCount('practice')})
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Grid Section */}
      <section ref={contentRef} className="relative py-8 md:py-16 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {loading ? (
              // Loading State
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative w-16 h-16 mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-t-2 border-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                <p className="text-gray-400">Loading content...</p>
              </motion.div>
            ) : filteredContent.length > 0 ? (
              // Content Grid
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredContent.map((item, index) => {
                  const dimension = DIMENSIONS[item.dimension];
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={contentInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.4 }}
                    >
                      <Link
                        href={getItemPath(item)}
                        className="group block h-full"
                      >
                        <div
                          className="relative h-full p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                          style={{
                            boxShadow: `0 0 0 0 ${dimension.color}00`,
                          }}
                        >
                          {/* Hover glow effect */}
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                              background: `radial-gradient(circle at 50% 0%, ${dimension.color}15, transparent 70%)`,
                            }}
                          />

                          {/* Top accent line */}
                          <div
                            className="absolute top-0 left-0 right-0 h-px transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                            style={{ background: dimension.color }}
                          />

                          {/* Content Type & Dimension Badges */}
                          <div className="flex items-center justify-between mb-4 relative z-10">
                            <span
                              className="text-xs font-medium px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: `${dimension.color}20`,
                                color: dimension.color,
                              }}
                            >
                              {dimension.name}
                            </span>
                            <span
                              className={`text-xs font-medium px-3 py-1 rounded-full ${
                                item.type === 'learn'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-green-500/20 text-green-400'
                              }`}
                            >
                              {item.type}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10">
                            {item.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed relative z-10">
                            {item.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 relative z-10">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-white/5 text-gray-500 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="px-2 py-1 text-xs text-gray-600">
                                +{item.tags.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Arrow indicator */}
                          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <svg
                              className="w-5 h-5"
                              style={{ color: dimension.color }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              // Empty State
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? `No content matches your search for "${searchQuery}"`
                    : 'No content available for the selected filter'}
                </p>
                {(searchQuery || selectedFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                    }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300"
                  >
                    Clear filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Bottom CTA */}
      {!loading && filteredContent.length > 0 && (
        <section className="relative py-16 md:py-24 bg-[#050505]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to dive deeper?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Explore the complete framework or try our flow-optimizing apps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/framework"
                  className="px-8 py-4 bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  Explore Framework
                </Link>
                <Link
                  href="/apps"
                  className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-full hover:bg-white/5 hover:border-gray-400 transition-all duration-300"
                >
                  View Apps
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
