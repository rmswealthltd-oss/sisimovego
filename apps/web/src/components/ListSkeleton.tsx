// apps/web/src/components/ListSkeleton.tsx
export default function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_,i) => (
        <div key={i} className="p-4 bg-white rounded shadow">
          <div className="flex justify-between items-center gap-4">
            <div className="w-3/4">
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
