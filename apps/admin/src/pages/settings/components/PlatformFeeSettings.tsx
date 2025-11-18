import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import Loading from "@/components/Loading";
import SectionHeader from "./SectionHeader";
import InputRow from "./InputRow";

export default function PlatformFeeSettings() {
  const [commission, setCommission] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/admin/settings/platform");
      setCommission(res?.commission ?? 0);
    } catch (e) {
      console.error(e);
      setCommission(0);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      await Api.put("/admin/settings/platform", {
        commission: commission ?? 0
      });
      alert("Platform commission saved");
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
      <SectionHeader
        title="Platform Commission"
        subtitle="Percentage of the fare the platform collects."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputRow label="Commission (%)">
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={commission ?? ""}
            onChange={(e) => setCommission(Number(e.target.value))}
          />
        </InputRow>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className={`px-4 py-2 rounded ${
            saving ? "bg-gray-400" : "bg-blue-600 text-white"
          }`}
        >
          {saving ? "Saving..." : "Save Commission"}
        </button>
      </div>
    </div>
  );
}
