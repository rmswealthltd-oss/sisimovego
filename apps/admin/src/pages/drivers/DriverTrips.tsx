import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { useSearchParams, Link } from "react-router-dom";

export default function DriverTrips() {
  const [params] = useSearchParams();
  const driverId = params.get("driverId");

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Required for Table v2
  const [page] = useState(1);
  const [pageSize] = useState(1000);

  useEffect(() => {
    if (!driverId) return;
    load();
  }, [driverId]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/trips?driverId=${driverId}`);
      setTrips(res.trips ?? res.rows ?? []);
    } catch (e) {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Driver Trips</PageTitle>

      {loading ? (
        <Loading />
      ) : (
        <Table<any>
          data={trips}
          loading={loading}
          total={trips.length}
          page={page}
          pageSize={pageSize}
          columns={[
            {
              id: "col-trip-id",
              accessor: "id",
              title: "Trip ID",
              render: (row) => (
                <Link to={`/trips?id=${row.id}`}>#{row.id}</Link>
              ),
            },
            {
              id: "col-origin",
              accessor: "origin",
              title: "Origin",
            },
            {
              id: "col-destination",
              accessor: "destination",
              title: "Destination",
            },
            {
              id: "col-departure",
              accessor: "departureAt",
              title: "Departure",
              render: (row) =>
                row.departureAt
                  ? new Date(row.departureAt).toLocaleString()
                  : "—",
            },
            {
              id: "col-seats",
              accessor: "seatsAvailable",
              title: "Seats left",
            },
            {
              id: "col-status",
              accessor: "status",
              title: "Status",
            },
          ]}
        />
      )}
    </div>
  );
}
