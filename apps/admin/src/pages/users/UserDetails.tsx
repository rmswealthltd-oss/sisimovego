import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import { useSearchParams } from "react-router-dom";
import { Api } from "../../lib/api";

export default function UserDetails() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) load(); }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/admin/users/${id}`);
      setUser(res.user ?? res);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <PageTitle>User #{user.id}</PageTitle>
      <div className="bg-white p-4 rounded shadow">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}</div>
        <div><strong>Driver ID:</strong> {user.driver?.id ?? "—"}</div>
      </div>
    </div>
  );
}
