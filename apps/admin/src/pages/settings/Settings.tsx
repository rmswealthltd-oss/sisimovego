"use client";

import { useEffect, useState } from "react";
import { Api } from "@/lib/api"; // your axios wrapper
import PageTitle from "@/components/PageTitle";
import Loading from "@/components/Loading";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<any | null>(null);
  const [value, setValue] = useState("");

  async function load() {
    try {
      const res = await Api.get("/admin/settings");
      setSettings(res); // Api returns response.data already
    } catch (e) {
      console.error("Settings load error:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(setting: any) {
    setEditing(setting);
    setValue(setting.value);
  }

  async function save() {
    try {
      await Api.put(`/admin/settings/${editing.key}`, { value });
      setEditing(null);
      load();
    } catch (e) {
      console.error("Save error:", e);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageTitle>System Settings</PageTitle>

      <div className="bg-white rounded shadow mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">Key</th>
              <th className="p-3">Value</th>
              <th className="p-3 w-20"></th>
            </tr>
          </thead>

          <tbody>
            {settings.map((s) => (
              <tr key={s.key} className="border-b">
                <td className="p-3">{s.key}</td>
                <td className="p-3 text-gray-700">{s.value}</td>
                <td className="p-3">
                  <button
                    onClick={() => openEdit(s)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Edit Setting: {editing.key}
            </h2>

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
