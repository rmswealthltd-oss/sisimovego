import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { Api } from "../../lib/api";
import Loading from "../../components/Loading";
import RefundTimeline from "./RefundTimeline";
import RefundRuleHits from "./RefundRuleHits";
import { Link, useSearchParams } from "react-router-dom";

export default function RefundDetails() {
  const [params] = useSearchParams();
  const id = params.get("id");

  const [refund, setRefund] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRefund();
  }, []);

  async function loadRefund() {
    try {
      const res = await Api.get(`/refunds/${id}`);
      setRefund(res.refund);
    } catch (e) {
      console.error(e);
      setRefund(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (!refund) return <div>Refund not found.</div>;

  return (
    <div>
      <PageTitle>
        Refund #{refund.id} — {refund.status}
      </PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main */}
        <div className="col-span-2 bg-white p-4 rounded shadow space-y-4">
          <h3 className="font-semibold text-lg">Refund Info</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Trip</div>
              <Link to={`/trips?id=${refund.tripId}`} className="text-blue-600 underline">
                Trip #{refund.tripId}
              </Link>
            </div>

            <div>
              <div className="text-gray-500">Passenger</div>
              <div>{refund.passenger?.name || refund.passenger?.email}</div>
            </div>

            <div>
              <div className="text-gray-500">Amount</div>
              <div>KES {(refund.amountCents / 100).toFixed(2)}</div>
            </div>

            <div>
              <div className="text-gray-500">Reason</div>
              <div className="capitalize">{refund.reason.replace("_", " ")}</div>
            </div>

            <div>
              <div className="text-gray-500">Created</div>
              <div>{new Date(refund.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <RefundTimeline id={refund.id} />
        </div>

        {/* Right column */}
        <div className="col-span-1">
          <RefundRuleHits id={refund.id} />
        </div>
      </div>
    </div>
  );
}
