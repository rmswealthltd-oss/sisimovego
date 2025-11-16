// apps/web/src/app/trip/_components/TripStatus.tsx
export default function TripStatus({ status }: { status?: string }) {
  const label = status ?? "unknown";
  const colors: Record<string,string> = {
    SCHEDULED: "text-blue-600",
    EN_ROUTE: "text-yellow-600",
    COMPLETED: "text-green-600",
    CANCELLED: "text-red-600",
  };
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`font-medium ${colors[label] ?? "text-gray-600"}`}>{label.replace(/_/g," ")}</span>
    </div>
  );
}
