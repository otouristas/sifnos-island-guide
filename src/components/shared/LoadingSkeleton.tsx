import { Card, CardContent } from '@/components/ui/card';

interface LoadingSkeletonProps {
  type?: 'hotel-card' | 'blog-card' | 'location-card' | 'text';
  count?: number;
}

export default function LoadingSkeleton({ type = 'hotel-card', count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'hotel-card':
        return (
          <Card className="overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        );
      case 'blog-card':
        return (
          <Card className="overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-200" />
            <CardContent className="p-4">
              <div className="h-5 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-1" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardContent>
          </Card>
        );
      case 'location-card':
        return (
          <Card className="overflow-hidden animate-pulse">
            <div className="h-56 bg-gray-200" />
            <CardContent className="p-5">
              <div className="h-6 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </CardContent>
          </Card>
        );
      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        );
      default:
        return <div className="h-32 bg-gray-200 rounded animate-pulse" />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}

