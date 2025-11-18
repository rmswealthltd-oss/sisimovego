import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import Loading from "@/components/Loading";
import SectionHeader from "./SectionHeader";

export default function VerificationSettings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/admin/settings/verification");
      setData(res ?? { requireDriverDocuments: true, requirePassengerId: true });
    } catch (e) {
      console.error(e);
      setData({ requireDriverDocuments: true, requirePassengerId: true });
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      await Api.put("/admin/settings/verification", data);
      alert("Verification saved");
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border max-w-2xl">
      <SectionHeader title="Verification Rules" subtitle="Enforce driver/passenger identity requirements." />

      <label className="flex items-center gap-3 mb-3">
        <input type="checkbox" checked={!!data.requireDriverDocuments} onChange={(e) => setData({ ...data, requireDriverDocuments: e.target.checked })} />
        <span>Require driver documents (license, ID)</span>
      </label>

      <label className="flex items-center gap-3 mb-3">
        <input type="checkbox" checked={!!data.requirePassengerId} onChange={(e) => setData({ ...data, requirePassengerId: e.target.checked })} />
        <span>Require passenger ID to join</span>
      </label>

      <div className="mt-4 flex justify-end">
        <button onClick={save} disabled={saving} className={`px-4 py-2 rounded ${saving ? "bg-gray-400" : "bg-blue-600 text-white"}`}>
          {saving ? "Saving..." : "Save verification"}
        </button>
      </div>
    </div>
  );
}
