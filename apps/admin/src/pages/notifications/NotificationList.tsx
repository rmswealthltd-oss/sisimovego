import { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import Loading from "@/components/Loading";
import PageTitle from "@/components/PageTitle";

export default function NotificationList() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await Api.get("/admin/notifications");
        setList(res);
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
      <PageTitle>Notifications</PageTitle>

      <div className="bg-white p-4 rounded shadow mt-4">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Title</th>
              <th>Body</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {list.map((n) => (
              <tr key={n.id} className="border-b">
                <td>{n.id}</td>
                <td>{n.user?.name}</td>
                <td>{n.title}</td>
                <td>{n.body}</td>
                <td>{new Date(n.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
