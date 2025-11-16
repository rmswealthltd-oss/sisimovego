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

  useEffect(() => {
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
        <Table
          columns={[
            { key: "id", title: "Trip ID", render: (t) => <Link to={`/trips?id=${t.id}`}>#{t.id}</Link> },
            { key: "origin", title: "Origin" },
            { key: "destination", title: "Destination" },
            { key: "departureAt", title: "Departure", render: (t) => new Date(t.departureAt).toLocaleString() },
            { key: "seatsAvailable", title: "Seats left" },
            { key: "status", title: "Status" }
          ]}
          data={trips}
        />
      )}
    </div>
  );
}
