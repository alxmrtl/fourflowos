'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getAllContent } from '@/data/content';
import { DIMENSIONS } from '@/data/framework';
import { ContentItem, DimensionType } from '@/types/framework';
import TopBar from '@/components/navigation/TopBar';

type FilterType = 'all' | DimensionType | 'learn' | 'practice';

export default function BlogPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load content from Sanity
  useEffect(() => {
    async function loadContent() {
      try {
        const content = await getAllContent();
        setAllContent(content);
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

    // Apply dimension/type filter using local data
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
    return `/dimension/${item.dimension}/key/${item.key}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <TopBar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Content Repository
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore all learning materials and practices across the four dimensions of flow. 
            Filter by dimension, content type, or search for specific topics.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* All */}
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({getFilterCount('all')})
            </button>

            {/* Dimensions */}
            {Object.values(DIMENSIONS).map((dimension) => (
              <button
                key={dimension.id}
                onClick={() => setSelectedFilter(dimension.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFilter === dimension.id
                    ? 'text-white'
                    : 'text-gray-700 hover:opacity-80'
                }`}
                style={{
                  backgroundColor: selectedFilter === dimension.id 
                    ? dimension.color 
                    : `${dimension.color}20`,
                  color: selectedFilter === dimension.id 
                    ? 'white' 
                    : dimension.color
                }}
              >
                {dimension.name} ({getFilterCount(dimension.id)})
              </button>
            ))}

            {/* Content Types */}
            <button
              onClick={() => setSelectedFilter('learn')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'learn'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Learn ({getFilterCount('learn')})
            </button>
            <button
              onClick={() => setSelectedFilter('practice')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'practice'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Practice ({getFilterCount('practice')})
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
              <svg className="animate-spin" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" opacity="0.3"/>
                <path d="M12 2v4c3.309 0 6 2.691 6 6h4c0-5.523-4.477-10-10-10z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading content...</h3>
            <p className="text-gray-600">Fetching your Flow Keys articles from Sanity</p>
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map((item) => {
              const dimension = DIMENSIONS[item.dimension];
              return (
                <Link
                  key={item.id}
                  href={getItemPath(item)}
                  className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-gray-300 overflow-hidden"
                >
                  {/* Content Type Badge */}
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${dimension.color}20`,
                          color: dimension.color 
                        }}
                      >
                        {dimension.name}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.type === 'learn' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 pt-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No content matches your search for "${searchQuery}"`
                : 'No content available for the selected filter'
              }
            </p>
            {(searchQuery || selectedFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}