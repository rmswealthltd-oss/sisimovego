import React, { useEffect, useState } from "react";
import { Api } from "../../lib/api";
import Loading from "../../components/Loading";

export default function RefundTimeline({ id }: { id: number }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await Api.get(`/refunds/${id}/timeline`);
      setEvents(res.timeline);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  if (!events.length)
    return <div className="bg-white p-4 rounded shadow">No timeline events.</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Timeline</h3>

      <ul className="border-l pl-4 space-y-4">
        {events.map((e, i) => (
          <li key={i} className="relative">
            <div className="absolute -left-2 top-1 w-3 h-3 bg-blue-600 rounded-full"></div>

            <div className="font-medium capitalize">{e.type.replace("_", " ")}</div>
            <div className="text-sm text-gray-500">
              {new Date(e.at).toLocaleString()}
            </div>
            {e.note && <div className="text-sm mt-1">{e.note}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
