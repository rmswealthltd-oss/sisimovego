import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import Loading from "@/components/Loading";
import Modal from "./Modal";
import SectionHeader from "./SectionHeader";
import InputRow from "./InputRow";

export default function GeneralSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [value, setValue] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/admin/settings");
      setSettings(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
      setSettings([]);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!editing) return;
    try {
      await Api.put(`/admin/settings/${editing.key}`, { value });
      setEditing(null);
      load();
    } catch (e) {
      console.error("save general", e);
      alert("Save failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <SectionHeader title="General Settings" subtitle="Core key/value settings." />

      <table className="w-full text-sm">
        <tbody>
          {settings.map((s) => (
            <tr key={s.key} className="border-b last:border-none">
              <td className="p-3 font-medium w-1/3">{s.key}</td>
              <td className="p-3 text-gray-700">{s.value}</td>
              <td className="p-3 text-right">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    setEditing(s);
                    setValue(s.value);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <Modal title={`Edit "${editing.key}"`} onClose={() => setEditing(null)}>
          <InputRow label={editing.key}>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            />
          </InputRow>

          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 border rounded" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={save}>
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
