import { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import Loading from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { Link } from "react-router-dom";

export default function BookingList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await Api.get("/admin/bookings");
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle>Bookings</PageTitle>

      <div className="bg-white p-4 rounded shadow mt-4">
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Trip</th>
              <th>Status</th>
              <th>Total (KES)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((b) => (
              <tr key={b.id} className="border-b">
                <td>
                  <Link to={`/admin/bookings/${b.id}`} className="text-blue-600">
                    {b.id}
                  </Link>
                </td>
                <td>{b.user?.name}</td>
                <td>{b.trip?.id}</td>
                <td>{b.status}</td>
                <td>{b.totalCents / 100}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
