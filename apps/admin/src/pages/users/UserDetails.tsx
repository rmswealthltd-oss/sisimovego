import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Api } from "../../lib/api";

export default function UserDetails() {
  const [params] = useSearchParams();
  const id = params.get("id");

  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/admin/users/${id}`);
      setUser(res.data ?? res);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(action: "suspend" | "activate") {
    try {
      await Api.put(`/admin/users/${id}/${action}`);
      load();
    } catch {
      alert("Failed to update status");
    }
  }

  async function deleteUser() {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    try {
      await Api.delete(`/admin/users/${id}`);
      navigate("/users");
    } catch {
      alert("Failed to delete user");
    }
  }

  if (loading) return <Loading />;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <PageTitle>User #{user.id}</PageTitle>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role:</strong> {user.isAdmin ? "Admin" : "User"}</div>
        <div><strong>Status:</strong> {user.suspended ? "Suspended" : "Active"}</div>
        <div><strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}</div>
      </div>

      <div className="flex gap-3 mb-4">
        {!user.suspended ? (
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded"
            onClick={() => updateStatus("suspend")}
          >
            Suspend User
          </button>
        ) : (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => updateStatus("activate")}
          >
            Reactivate User
          </button>
        )}

        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={deleteUser}
        >
          Delete User
        </button>
      </div>

      <Link to={`/users/trips?userId=${id}`} className="text-blue-600 underline">
        View User Trips →
      </Link>
    </div>
  );
}
