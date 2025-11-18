import { useEffect, useState, useMemo } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";
import { downloadFile } from "../../utils/download";

// Types
interface DriverRow {
  id: string;
  name: string;
  phone: string;
  suspended: boolean;
  driver: {
    id: string;
    phone: string;
    vehicle?: {
      make: string;
      model: string;
      regNo: string;
    };
  };
}

export default function DriversList() {
  const [drivers, setDrivers] = useState<DriverRow[]>([]);
  const [loading, setLoading] = useState(true);

  // filters / UI state
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<keyof DriverRow | "">("");
  const [dir, setDir] = useState<"asc" | "desc">("asc");

  const pageSize = 20;

  //
  // 🔍 Debounced Search
  //
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  //
  // Load drivers (search + sort)
  //
  useEffect(() => {
    loadDrivers();
  }, [search]);

  async function loadDrivers() {
    setLoading(true);
    try {
      const q = search ? `?q=${encodeURIComponent(search)}` : "";
      const res = await Api.get(`/admin/users${q}`);

      const list = Array.isArray(res) ? res : res.users ?? [];
      const filtered = list.filter((u: any) => u.driver);

      setDrivers(filtered);
      setPage(1);
      setSelected([]);
    } catch {
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  }

  //
  // 🔽 Sorting logic (client-side)
  //
  const sorted = useMemo(() => {
    if (!sort) return drivers;

    return [...drivers].sort((a, b) => {
      const va = String((a as any)[sort] ?? "");
      const vb = String((b as any)[sort] ?? "");
      return dir === "asc"
        ? va.localeCompare(vb)
        : vb.localeCompare(va);
    });
  }, [drivers, sort, dir]);

  //
  // Pagination
  //
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  //
  // Bulk actions
  //
  function toggleSelectAll() {
    if (selected.length === paginated.length) {
      setSelected([]);
    } else {
      setSelected(paginated.map((d) => d.driver.id));
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function bulkSuspend() {
    if (!selected.length) return alert("No drivers selected.");
    if (!confirm(`Suspend ${selected.length} drivers?`)) return;

    await Api.post("/admin/drivers/suspend-bulk", { ids: selected });
    loadDrivers();
  }

  async function bulkActivate() {
    if (!selected.length) return alert("No drivers selected.");
    if (!confirm(`Activate ${selected.length} drivers?`)) return;

    await Api.post("/admin/drivers/activate-bulk", { ids: selected });
    loadDrivers();
  }

  //
  // 📄 Export CSV
  //
  function exportCSV() {
    const rows = drivers.map((d) => ({
      id: d.driver.id,
      name: d.name,
      phone: d.driver.phone,
      suspended: d.suspended ? "YES" : "NO",
      vehicle: d.driver.vehicle
        ? `${d.driver.vehicle.make} ${d.driver.vehicle.model} ${d.driver.vehicle.regNo}`
        : "",
    }));

    const header = Object.keys(rows[0] || {}).join(",");
    const body = rows.map((r) => Object.values(r).join(",")).join("\n");

    downloadFile("drivers.csv", header + "\n" + body, "text/csv");
  }

  //
  // 📊 Export Excel (simple CSV renamed to .xls)
  //
  function exportExcel() {
    const rows = drivers.map((d) => ({
      id: d.driver.id,
      name: d.name,
      phone: d.driver.phone,
      suspended: d.suspended ? "YES" : "NO",
      vehicle: d.driver.vehicle
        ? `${d.driver.vehicle.make} ${d.driver.vehicle.model} ${d.driver.vehicle.regNo}`
        : "",
    }));

    const header = Object.keys(rows[0] || {}).join("\t");
    const body = rows.map((r) => Object.values(r).join("\t")).join("\n");

    downloadFile("drivers.xls", header + "\n" + body, "application/vnd.ms-excel");
  }

  //
  // Render
  //
  return (
    <div>
      <PageTitle>Drivers</PageTitle>

      {/* Search + Export + Bulk actions */}
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <input
          className="border px-3 py-2 rounded flex-1 min-w-[220px]"
          placeholder="Search driver (name, phone, vehicle)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <button
          className="px-3 py-2 bg-blue-600 text-white rounded"
          onClick={exportCSV}
        >
          Export CSV
        </button>

        <button
          className="px-3 py-2 bg-green-600 text-white rounded"
          onClick={exportExcel}
        >
          Export Excel
        </button>

        {selected.length > 0 && (
          <>
            <button
              className="px-3 py-2 bg-red-600 text-white rounded"
              onClick={bulkSuspend}
            >
              Suspend ({selected.length})
            </button>

            <button
              className="px-3 py-2 bg-yellow-600 text-black rounded"
              onClick={bulkActivate}
            >
              Activate ({selected.length})
            </button>
          </>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : (
        <Table<DriverRow>
          data={paginated}
          total={drivers.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          sort={sort}
          dir={dir}
          onSortChange={({ accessor, direction }) => {
            setSort(accessor as any);
            setDir(direction);
          }}
          columns={[
            {
              id: "select",
              accessor: "actions",
              title: (
                <input
                  type="checkbox"
                  checked={
                    selected.length > 0 &&
                    selected.length === paginated.length
                  }
                  onChange={toggleSelectAll}
                />
              ),
              render: (r) => (
                <input
                  type="checkbox"
                  checked={selected.includes(r.driver.id)}
                  onChange={() => toggleSelect(r.driver.id)}
                />
              ),
            },
            {
              id: "driver-id",
              accessor: "id",
              title: "ID",
              sortable: true,
              render: (r) => (
                <Link
                  to={`/drivers/profile?id=${r.driver.id}`}
                  className="text-blue-600 underline"
                >
                  #{r.driver.id}
                </Link>
              ),
            },
            {
              id: "name",
              accessor: "name",
              title: "Name",
              sortable: true,
              render: (r) => r.name || "—",
            },
            {
              id: "phone",
              accessor: "phone",
              title: "Phone",
              render: (r) => r.driver?.phone ?? r.phone,
            },
            {
              id: "vehicle",
              accessor: "vehicle",
              title: "Vehicle",
              render: (r) =>
                r.driver?.vehicle
                  ? `${r.driver.vehicle.make} ${r.driver.vehicle.model} (${r.driver.vehicle.regNo})`
                  : "—",
            },
            {
              id: "status",
              accessor: "suspended",
              title: "Status",
              render: (r) =>
                r.suspended ? (
                  <span className="text-red-600 font-semibold">Suspended</span>
                ) : (
                  <span className="text-green-600 font-semibold">Active</span>
                ),
            },
            {
              id: "actions2",
              accessor: "actions2",
              title: "Actions",
              render: (r) => (
                <div className="flex gap-2">
                  <Link
                    to={`/drivers/profile?id=${r.driver.id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>
                  <Link
                    to={`/drivers/trips?driverId=${r.driver.id}`}
                    className="text-blue-600 underline"
                  >
                    Trips
                  </Link>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
