import { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { Api } from "../../lib/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

type Payout = {
  id: string;
  driverId: string;
  driver?: { user?: { name?: string } };
  amountCents: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  createdAt: string;
};

export default function PayoutList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [data, setData] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const filter = params.get("status") ?? "";
  const page = Number(params.get("page") ?? 1);
  const sort = params.get("sort") ?? "";
  const dir = (params.get("dir") as "asc" | "desc") ?? "asc";

  useEffect(() => {
    load();
  }, [filter, page, sort, dir]);

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        ...(filter ? { status: filter } : {}),
        page: String(page),
        sort,
        dir
      });

      const res = await Api.get(`/admin/payouts?${qs.toString()}`);
      setData(res.payouts ?? res.rows ?? []);
      setTotal(res.total ?? 0);
    } catch (e) {
      console.error(e);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  function updateParams(next: Record<string, any>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (!v) merged.delete(k);
      else merged.set(k, String(v));
    });
    setParams(merged);
  }

  async function approve(id: string) {
    if (!confirm("Approve this payout?")) return;
    await Api.post(`/admin/payouts/${id}/approve`);
    load();
  }

  async function reject(id: string) {
    if (!confirm("Reject this payout?")) return;
    await Api.post(`/admin/payouts/${id}/reject`);
    load();
  }

  async function markPaid(id: string) {
    const tx = prompt("Enter provider transaction id:");
    if (!tx) return;
    await Api.post(`/admin/payouts/${id}/mark-paid`, { providerTxId: tx });
    load();
  }

  return (
    <div>
      <PageTitle>Payouts</PageTitle>

      {/* FILTERS */}
      <div className="mb-4 flex items-center gap-3">
        <select
          value={filter}
          onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
          className="border px-3 py-2 rounded"
        >
          <option value="">All statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="PAID">PAID</option>
        </select>

        <button
          onClick={() => navigate("/admin/payouts/batches")}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          View Batches
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <Table<Payout>
          data={data}
          total={total}
          page={page}
          pageSize={20}
          loading={loading}
          sort={sort}
          dir={dir}
          onPageChange={(p) => updateParams({ page: p })}
          onSortChange={({ accessor, direction }) =>
            updateParams({ sort: accessor, dir: direction })
          }
          columns={[
            {
              id: "id",
              accessor: "id",
              title: "ID",
              sortable: true,
              render: (row) => (
                <Link to={`/admin/payouts/${row.id}`} className="text-blue-600">
                  #{row.id}
                </Link>
              ),
            },
            {
              id: "driver",
              accessor: "driverId",
              title: "Driver",
              render: (row) =>
                row.driver?.user?.name ??
                `Driver ${row.driverId.slice(0, 6)}...`,
            },
            {
              id: "amount",
              accessor: "amountCents",
              title: "Amount (KES)",
              sortable: true,
              render: (row) => (row.amountCents / 100).toLocaleString(),
            },
            {
              id: "status",
              accessor: "status",
              title: "Status",
              sortable: true,
            },
            {
              id: "created",
              accessor: "createdAt",
              title: "Created",
              sortable: true,
              render: (row) => new Date(row.createdAt).toLocaleString(),
            },
            {
              id: "actions",
              accessor: "actions",
              title: "Actions",
              render: (row) => (
                <div className="flex gap-2 text-sm">
                  {row.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => approve(row.id)}
                        className="text-green-600 hover:underline"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reject(row.id)}
                        className="text-orange-600 hover:underline"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {row.status === "APPROVED" && (
                    <button
                      onClick={() => markPaid(row.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
