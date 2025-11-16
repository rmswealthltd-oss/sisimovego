import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { useSearchParams } from "react-router-dom";

export default function DriverPayouts() {
  const [params] = useSearchParams();
  const driverId = params.get("driverId");
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [driverId]);

  async function load() {
    setLoading(true);
    try {
      // GET /api/payouts?driverId=...
      const res = await Api.get(`/payouts?driverId=${driverId}`);
      setPayouts(res.payouts ?? res.rows ?? []);
    } catch (e) {
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Driver Payouts</PageTitle>

      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={[
            { key: "id", title: "Payout ID" },
            { key: "amount", title: "Amount", render: (r) => `KES ${(r.amount / 100).toFixed(2)}` },
            { key: "status", title: "Status" },
            { key: "providerTxId", title: "Provider Tx" },
            { key: "createdAt", title: "Created", render: (r) => new Date(r.createdAt).toLocaleString() }
          ]}
          data={payouts}
        />
      )}
    </div>
  );
}
