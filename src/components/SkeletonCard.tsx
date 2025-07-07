// Location: src/components/SkeletonCard.tsx

export const SkeletonCard = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 mb-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-3">
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-3 bg-gray-700 rounded w-1/4"></div>
      </div>
      
      {/* Address Lines Skeleton */}
      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-4 bg-gray-700 rounded"></div>
          <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-4 bg-gray-700 rounded"></div>
          <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>

      {/* Value Skeleton */}
      <div className="mt-4 flex justify-end">
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  );
};