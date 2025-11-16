// apps/web/src/components/Skeleton.tsx
export default function Skeleton({ className = "h-4 bg-gray-200 rounded", children }: { className?: string; children?: any }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children ?? null}
    </div>
  );
}
