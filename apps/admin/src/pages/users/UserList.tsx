import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/admin/users${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      setUsers(res.users ?? res);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Users</PageTitle>
      <div className="mb-4 flex gap-2">
        <input className="border px-3 py-2 rounded flex-1" placeholder="Search name/email" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={load}>Search</button>
      </div>

      {loading ? <Loading /> : (
        <Table
          columns={[
            { key: "id", title: "ID", render: (u) => <Link to={`/users/${u.id}`}>#{u.id}</Link> },
            { key: "name", title: "Name" },
            { key: "email", title: "Email" },
            { key: "role", title: "Role", render: (u) => u.isAdmin ? "Admin" : "User" },
            { key: "createdAt", title: "Joined", render: (u) => new Date(u.createdAt).toLocaleString() }
          ]}
          data={users}
        />
      )}
    </div>
  );
}
