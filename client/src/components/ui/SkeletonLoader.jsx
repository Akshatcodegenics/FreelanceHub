import React from 'react';

const SkeletonLoader = ({ type = 'gig', count = 6, viewMode = 'grid' }) => {
  const renderGigSkeleton = () => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse ${
      viewMode === 'list' ? 'flex' : ''
    }`}>
      <div className={`${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
        <div className={`bg-gray-200 animate-shimmer ${
          viewMode === 'list' ? 'h-full' : 'h-48'
        }`}></div>
      </div>
      
      <div className="p-6 flex-1">
        <div className="mb-3">
          <div className="h-5 bg-gray-200 rounded animate-shimmer mb-2"></div>
          <div className="h-5 bg-gray-200 rounded animate-shimmer w-3/4"></div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-shimmer mr-3"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded animate-shimmer w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded animate-shimmer w-16"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-4 bg-gray-200 rounded animate-shimmer w-24"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-16"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="h-3 bg-gray-200 rounded animate-shimmer w-16 mb-1"></div>
            <div className="h-6 bg-gray-200 rounded animate-shimmer w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategorySkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-pulse">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-2xl animate-shimmer mb-4"></div>
      </div>
      
      <div>
        <div className="h-6 bg-gray-200 rounded animate-shimmer mb-3"></div>
        <div className="h-4 bg-gray-200 rounded animate-shimmer mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-20"></div>
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-16"></div>
        </div>
      </div>
    </div>
  );

  const renderStatSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-20 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded animate-shimmer w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-shimmer"></div>
      </div>
    </div>
  );

  const renderHeroSkeleton = () => (
    <div className="bg-gradient-to-br from-gray-300 to-gray-400 py-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="h-12 bg-gray-200 rounded animate-shimmer mb-6 mx-auto w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded animate-shimmer mb-8 mx-auto w-1/2"></div>
        <div className="max-w-2xl mx-auto mb-8">
          <div className="h-12 bg-gray-200 rounded-xl animate-shimmer"></div>
        </div>
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full animate-shimmer w-20"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSkeletons = () => {
    switch (type) {
      case 'gig':
        return [...Array(count)].map((_, i) => (
          <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
            {renderGigSkeleton()}
          </div>
        ));
      case 'category':
        return [...Array(count)].map((_, i) => (
          <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
            {renderCategorySkeleton()}
          </div>
        ));
      case 'stat':
        return [...Array(count)].map((_, i) => (
          <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
            {renderStatSkeleton()}
          </div>
        ));
      case 'hero':
        return renderHeroSkeleton();
      default:
        return renderGigSkeleton();
    }
  };

  if (type === 'hero') {
    return renderSkeletons();
  }

  return (
    <div className={`${
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-6'
    }`}>
      {renderSkeletons()}
    </div>
  );
};

export default SkeletonLoader;
