import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function DriversList() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    setLoading(true);
    try {
      const q = search ? `?q=${encodeURIComponent(search)}` : "";
      // GET /api/admin/users?filter=drivers (server returns users with driver relation)
      const res = await Api.get(`/admin/users${q}`);
      // backend may return full users; we filter drivers here if needed
      const list = Array.isArray(res) ? res : res.users ?? [];
      setDrivers(list.filter((u: any) => u.driver));
    } catch (e) {
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Drivers</PageTitle>

      <div className="mb-4 flex gap-2">
        <input
          className="border px-3 py-2 rounded flex-1"
          placeholder="Search by name, phone, vehicle"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => loadDrivers()}
        >
          Search
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={[
            {
              key: "id",
              title: "Driver ID",
              render: (r) => <Link to={`/drivers/profile?id=${r.driver?.id}`}>#{r.driver?.id}</Link>
            },
            { key: "name", title: "Name", render: (r) => r.name || "—" },
            { key: "phone", title: "Phone", render: (r) => r.driver?.phone ?? r.phone },
            {
              key: "vehicle",
              title: "Vehicle",
              render: (r) =>
                r.driver?.vehicle ? `${r.driver.vehicle.make} ${r.driver.vehicle.model} (${r.driver.vehicle.regNo})` : "—"
            },
            {
              key: "status",
              title: "Status",
              render: (r) => (r.suspended ? <span className="text-red-600">Suspended</span> : <span className="text-green-600">Active</span>)
            },
            {
              key: "actions",
              title: "Actions",
              render: (r) => (
                <div className="flex gap-2">
                  <Link to={`/drivers/profile?id=${r.driver?.id}`} className="text-blue-600 underline">
                    View
                  </Link>
                  <Link to={`/drivers/trips?driverId=${r.driver?.id}`} className="text-blue-600 underline">
                    Trips
                  </Link>
                </div>
              )
            }
          ]}
          data={drivers}
        />
      )}
    </div>
  );
}
