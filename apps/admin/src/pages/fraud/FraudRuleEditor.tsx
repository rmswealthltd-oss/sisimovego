import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { useSearchParams } from "react-router-dom";
import { Api } from "../../lib/api";
import Loading from "../../components/Loading";

export default function FraudRuleEditor() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [rule, setRule] = useState<any>({ name: "", description: "", weight: 1, enabled: true });
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (id) load(); }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/fraud/rules/${id}`);
      setRule(res.rule);
    } catch (e) {
      setRule({ name: "", description: "", weight: 1, enabled: true });
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      if (id) await Api.put(`/fraud/rules/${id}`, rule);
      else await Api.post("/fraud/rules", rule);
      alert("Saved");
    } catch (e: any) {
      alert(e?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle>{id ? "Edit Rule" : "New Rule"}</PageTitle>

      <div className="bg-white p-4 rounded shadow max-w-2xl">
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input className="w-full border px-3 py-2 rounded" value={rule.name} onChange={(e) => setRule({ ...rule, name: e.target.value })} />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border px-3 py-2 rounded" value={rule.description} onChange={(e) => setRule({ ...rule, description: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Weight</label>
            <input type="number" className="w-full border px-3 py-2 rounded" value={rule.weight} onChange={(e) => setRule({ ...rule, weight: Number(e.target.value) })} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Enabled</label>
            <select className="w-full border px-3 py-2 rounded" value={String(rule.enabled)} onChange={(e) => setRule({ ...rule, enabled: e.target.value === "true" })}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
