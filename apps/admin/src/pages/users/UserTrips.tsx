import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { useSearchParams, Link } from "react-router-dom";
import { Api } from "../../lib/api";

export default function UserTrips() {
  const [params] = useSearchParams();
  const userId = params.get("userId");
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [userId]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/admin/users/${userId}/trips`);
      setTrips(res.data ?? res);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>User Trips</PageTitle>

      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={[
            {
              key: "id",
              title: "Trip ID",
              render: (t) => <Link to={`/trips/details?id=${t.id}`}>#{t.id}</Link>,
            },
            { key: "origin", title: "Origin" },
            { key: "destination", title: "Destination" },
            {
              key: "departureAt",
              title: "Departure",
              render: (t) => new Date(t.departureAt).toLocaleString(),
            },
            { key: "status", title: "Status" },
          ]}
          data={trips}
        />
      )}
    </div>
  );
}
