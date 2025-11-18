import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { useSearchParams } from "react-router-dom";

interface Payout {
  id: string;
  amount: number;
  status: string;
  providerTxId?: string;
  createdAt: string;
}

export default function DriverPayouts() {
  const [params] = useSearchParams();
  const driverId = params.get("driverId");
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const total = payouts.length;
  const paginated = payouts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    load();
  }, [driverId]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/payouts?driverId=${driverId}`);
      setPayouts(res.payouts ?? res.rows ?? []);
    } catch {
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
        <Table<Payout>
          data={paginated}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          columns={[
            {
              id: "payout-id",
              accessor: "id",
              title: "Payout ID",
              render: (r) => <>{r.id}</>,
            },
            {
              id: "amount",
              accessor: "amount",
              title: "Amount",
              render: (r) => `KES ${(r.amount / 100).toFixed(2)}`,
            },
            {
              id: "status",
              accessor: "status",
              title: "Status",
            },
            {
              id: "providerTxId",
              accessor: "providerTxId",
              title: "Provider Tx",
            },
            {
              id: "createdAt",
              accessor: "createdAt",
              title: "Created",
              render: (r) => new Date(r.createdAt).toLocaleString(),
            },
          ]}
        />
      )}
    </div>
  );
}
