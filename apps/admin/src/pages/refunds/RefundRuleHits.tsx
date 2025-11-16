import React, { useEffect, useState } from "react";
import { Api } from "../../lib/api";
import Loading from "../../components/Loading";

export default function RefundRuleHits({ id }: { id: number }) {
  const [hits, setHits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await Api.get(`/refunds/${id}/rule-hits`);
      setHits(res.hits);
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Rule Hits</h3>

      {!hits.length ? (
        <div className="text-sm text-gray-600">No rules triggered.</div>
      ) : (
        <ul className="space-y-3 text-sm">
          {hits.map((h, i) => (
            <li key={i} className="p-3 border rounded">
              <div className="font-semibold">{h.ruleName}</div>
              <div className="text-gray-600">{h.description}</div>
              <div className="text-xs text-gray-400 mt-1">
                Score: {h.score}, Weight: {h.weight}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
