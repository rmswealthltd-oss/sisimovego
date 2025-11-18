import { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import Loading from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { Link, useSearchParams } from "react-router-dom";

interface NotificationRow {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  user?: { id: string; name?: string };
}

export default function NotificationList() {
  const [params, setParams] = useSearchParams();

  // URL state
  const q = params.get("q") ?? "";
  const page = Number(params.get("page") ?? 1);
  const sort = params.get("sort") ?? "createdAt";
  const dir = (params.get("dir") as "asc" | "desc") ?? "desc";

  // data state
  const [list, setList] = useState<NotificationRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageSize = 20;

  useEffect(() => {
    load();
  }, [q, page, sort, dir]);

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        q,
        page: page.toString(),
        sort,
        dir
      });

      const res = await Api.get(`/admin/notifications?${qs.toString()}`);

      setList(res.notifications ?? res.rows ?? []);
      setTotal(res.total ?? 0);
    } catch (err) {
      console.error(err);
      setList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  function update(next: Record<string, any>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (!v) merged.delete(k);
      else merged.set(k, String(v));
    });
    setParams(merged);
  }

  function toggleSort(field: string) {
    if (sort === field) {
      update({ sort: field, dir: dir === "asc" ? "desc" : "asc", page: 1 });
    } else {
      update({ sort: field, dir: "asc", page: 1 });
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle>Notifications</PageTitle>

      {/* Search + New Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Search title/body/user"
            value={q}
            onChange={(e) => update({ q: e.target.value, page: 1 })}
          />
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded"
            onClick={() => update({ q, page: 1 })}
          >
            Search
          </button>
        </div>

        <Link
          to="/admin/notifications/send"
          className="px-3 py-2 bg-green-600 text-white rounded"
        >
          Send Notification
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="border-b bg-gray-50">
            <tr>
              <Th name="id" label="ID" onClick={toggleSort} sort={sort} dir={dir} />
              <Th name="title" label="Title" onClick={toggleSort} sort={sort} dir={dir} />
              <Th name="body" label="Body" />
              <Th name="user" label="User" />
              <Th name="createdAt" label="Created" onClick={toggleSort} sort={sort} dir={dir} />
            </tr>
          </thead>

          <tbody>
            {list.map((n) => (
              <tr key={n.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{n.id}</td>
                <td className="p-2">{n.title}</td>
                <td className="p-2 max-w-[300px] truncate">{n.body}</td>
                <td className="p-2">{n.user?.name ?? "—"}</td>
                <td className="p-2">{new Date(n.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {list.length === 0 && (
          <div className="text-center py-6 text-gray-500">No notifications</div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>
            Page {page} of {Math.ceil(total / pageSize) || 1}
          </div>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              className="px-3 py-1 border rounded disabled:opacity-40"
              onClick={() => update({ page: page - 1 })}
            >
              Prev
            </button>
            <button
              disabled={page >= Math.ceil(total / pageSize)}
              className="px-3 py-1 border rounded disabled:opacity-40"
              onClick={() => update({ page: page + 1 })}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable table header with sorting */
function Th({
  name,
  label,
  sort,
  dir,
  onClick
}: {
  name: string;
  label: string;
  sort?: string;
  dir?: "asc" | "desc";
  onClick?: (field: string) => void;
}) {
  const isSorted = sort === name;

  return (
    <th
      className="p-2 text-left cursor-pointer select-none"
      onClick={() => onClick && onClick(name)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isSorted && (dir === "asc" ? "↑" : "↓")}
      </div>
    </th>
  );
}
