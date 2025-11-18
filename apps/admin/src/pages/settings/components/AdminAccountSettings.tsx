import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import Loading from "@/components/Loading";
import SectionHeader from "./SectionHeader";

export default function AdminAccountSettings() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pwd, setPwd] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/admin/settings/account");
      setProfile(res ?? {});
    } catch (e) {
      console.error(e);
      setProfile({});
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    try {
      await Api.put("/admin/settings/account", profile);
      alert("Profile saved");
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (pwd.length < 6) return alert("Password must be at least 6 characters");
    try {
      await Api.put("/admin/settings/account/password", { password: pwd });
      setPwd("");
      alert("Password updated");
    } catch (e) {
      console.error(e);
      alert("Password change failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border max-w-2xl">
        <SectionHeader title="Admin Profile" />
        <label className="block mb-3">
          <div className="text-sm text-gray-600 mb-1">Name</div>
          <input className="border p-2 w-full rounded" value={profile?.name ?? ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </label>

        <label className="block mb-3">
          <div className="text-sm text-gray-600 mb-1">Email</div>
          <input className="border p-2 w-full rounded" value={profile?.email ?? ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        </label>

        <div className="flex justify-end">
          <button onClick={saveProfile} disabled={saving} className={`px-4 py-2 rounded ${saving ? "bg-gray-400" : "bg-blue-600 text-white"}`}>
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border max-w-2xl">
        <SectionHeader title="Change Password" />
        <input type="password" placeholder="New password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="border p-2 w-full rounded mb-3" />
        <div className="flex justify-end">
          <button onClick={changePassword} className="px-4 py-2 bg-blue-600 text-white rounded">
            Update password
          </button>
        </div>
      </div>
    </div>
  );
}
