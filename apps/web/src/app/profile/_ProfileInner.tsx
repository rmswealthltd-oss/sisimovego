"use client";

import { useState } from "react";
import { Api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function EditProfileInner() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);

  if (!user) return <div className="p-4">You must be logged in.</div>;

  async function save() {
    setSaving(true);

    try {
      await Api.patch("/profile/update", { name, email });
      alert("Profile updated!");
      // Optionally: redirect or reload
      window.location.href = "/profile";
    } catch (e: any) {
      alert(e?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      <div className="bg-white shadow rounded p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="mt-1 w-full p-2 border rounded"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full p-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
