import { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import { useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import PageTitle from "@/components/PageTitle";

export default function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await Api.get(`/admin/bookings/${id}`);
        setBooking(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle>Booking Details</PageTitle>

      <div className="bg-white p-4 rounded shadow mt-4">
        <pre className="text-sm">{JSON.stringify(booking, null, 2)}</pre>
      </div>
    </div>
  );
}
