import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import TripFilters from "./TripFilters";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function TripList() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({
    status: "",
    driverId: "",
    passengerId: "",
    from: "",
    to: ""
  });

  useEffect(() => {
    loadTrips();
  }, [filters]);

  async function loadTrips() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) q.set(k, v as string);
      });

      const res = await Api.get(`/trips?${q.toString()}`);
      setTrips(res.trips ?? []);
    } catch (e) {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Trips</PageTitle>

      <TripFilters value={filters} onChange={setFilters} />

      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={[
            { key: "id", title: "Trip ID" },
            { key: "origin", title: "Origin" },
            { key: "destination", title: "Destination" },
            {
              key: "fare",
              title: "Fare (KES)",
              render: (t) => (t.fareCents / 100).toFixed(2)
            },
            {
              key: "status",
              title: "Status",
              render: (t) => (
                <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                  {t.status}
                </span>
              )
            },
            {
              key: "driver",
              title: "Driver",
              render: (t) => t.driver?.name ?? "—"
            },
            {
              key: "actions",
              title: "Actions",
              render: (t) => (
                <Link
                  to={`/trips?id=${t.id}`}
                  className="text-blue-600 underline"
                >
                  View
                </Link>
              )
            }
          ]}
          data={trips}
        />
      )}
    </div>
  );
}
