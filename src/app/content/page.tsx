import Link from 'next/link';
import TopBar from '@/components/navigation/TopBar';
import { CONTENT_REPOSITORY } from '@/data/content';
import { DIMENSIONS } from '@/data/framework';

export default function ContentRepository() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Content Repository</h1>
          <p className="text-lg text-gray-600">
            Explore all FourFlow learning materials and practice exercises
          </p>
        </div>

        <div className="grid gap-6">
          {CONTENT_REPOSITORY.map((item) => {
            const dimensionData = DIMENSIONS[item.dimension];
            
            return (
              <Link
                key={item.id}
                href={`/content/${item.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 group"
                style={{
                  borderLeft: `4px solid ${dimensionData.color}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-white"
                        style={{ backgroundColor: dimensionData.color }}
                      >
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {dimensionData.name} → {item.key.replace('-', ' ')}
                      </span>
                      {item.is_pinned && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          📌 Pinned
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {tag.replace('-', ' ')}
                          </span>
                        ))}
                        {item.tags.length > 5 && (
                          <span className="px-2 py-1 rounded text-xs text-gray-500">
                            +{item.tags.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    {item.read_time || item.estimated_duration || 5} min
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}