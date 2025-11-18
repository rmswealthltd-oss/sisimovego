import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import Loading from "@/components/Loading";
import SectionHeader from "./SectionHeader";
import InputRow from "./InputRow";

export default function PriceSettings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/admin/settings/pricing");
      setData(res ?? {});
    } catch (e) {
      console.error(e);
      setData({});
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      await Api.put("/admin/settings/pricing", data);
      alert("Pricing saved");
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
      <SectionHeader title="Price Settings" subtitle="Base fare, per km/min, minimums." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputRow label="Base fare (KES)">
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={data.baseFare ?? ""}
            onChange={(e) => setData({ ...data, baseFare: Number(e.target.value) })}
          />
        </InputRow>

        <InputRow label="Price per km (KES)">
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={data.pricePerKm ?? ""}
            onChange={(e) => setData({ ...data, pricePerKm: Number(e.target.value) })}
          />
        </InputRow>

        <InputRow label="Price per minute (KES)">
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={data.pricePerMinute ?? ""}
            onChange={(e) => setData({ ...data, pricePerMinute: Number(e.target.value) })}
          />
        </InputRow>

        <InputRow label="Minimum fare (KES)">
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={data.minFare ?? ""}
            onChange={(e) => setData({ ...data, minFare: Number(e.target.value) })}
          />
        </InputRow>

        <InputRow label="Surge multiplier">
          <input
            type="number"
            step="0.1"
            className="border p-2 w-full rounded"
            value={data.surge ?? ""}
            onChange={(e) => setData({ ...data, surge: Number(e.target.value) })}
          />
        </InputRow>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className={`px-4 py-2 rounded ${saving ? "bg-gray-400" : "bg-blue-600 text-white"}`}
        >
          {saving ? "Saving..." : "Save pricing"}
        </button>
      </div>
    </div>
  );
}
