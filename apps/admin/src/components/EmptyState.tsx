export default function EmptyState({
  title = "Nothing here yet",
  subtitle = "Try adjusting your filters or check again later.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="p-8 text-center text-gray-500">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}
