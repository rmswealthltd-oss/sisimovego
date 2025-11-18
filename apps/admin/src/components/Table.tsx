import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type Column<T> = {
  /** Internal key to help React render */
  id: string;

  /** Field from the model, or virtual column */
  accessor?: keyof T | string;

  /** Column title */
  title: string;

  /** Sort toggle */
  sortable?: boolean;

  /** Custom cell renderer */
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;

  total: number;
  page: number;
  pageSize: number;

  onPageChange?: (page: number) => void;

  onSortChange?: (opts: {
    accessor: string;
    direction: "asc" | "desc";
  }) => void;

  sort?: string;
  dir?: "asc" | "desc";
};

export default function Table<T>({
  data,
  columns,
  loading = false,

  total,
  page,
  pageSize,

  onPageChange,
  onSortChange,
  sort,
  dir = "asc",
}: Props<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function toggleSort(col: Column<T>) {
    if (!onSortChange || !col.sortable || !col.accessor) return;

    const newDir =
      sort === col.accessor && dir === "asc" ? "desc" : "asc";

    onSortChange({
      accessor: col.accessor as string,
      direction: newDir,
    });
  }

  function getCell(row: T, col: Column<T>) {
    if (col.render) return col.render(row);
    if (!col.accessor) return "";

    return (row as any)[col.accessor];
  }

  return (
    <div className="w-full border rounded-md overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => {
              const active = sort === col.accessor;
              const asc = active && dir === "asc";

              return (
                <th
                  key={col.id}
                  className={`px-3 py-2 whitespace-nowrap text-left ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  onClick={() => toggleSort(col)}
                >
                  <div className="flex items-center gap-1">
                    {col.title}

                    {col.sortable && active && (
                      asc ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                No data
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-t">
                {columns.map((col) => (
                  <td key={col.id} className="px-3 py-2">
                    {getCell(row, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
        <div className="text-sm">
          Page {page} of {totalPages}
        </div>

        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
