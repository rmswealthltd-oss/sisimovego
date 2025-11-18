import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import Loading from "@/components/Loading";
import SectionHeader from "./SectionHeader";
import InputRow from "./InputRow";

type Location = {
  id: string;
  name: string;
  parentId?: string | null;
  type?: string;
};

export default function LocationSettings() {
  const [items, setItems] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", type: "city", parentId: "" });
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/admin/settings/locations");
      setItems(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    if (!form.name.trim()) return alert("Name required");
    setCreating(true);
    try {
      await Api.post("/admin/settings/locations", {
        name: form.name.trim(),
        type: form.type,
        parentId: form.parentId || null,
      });
      setForm({ name: "", type: "city", parentId: "" });
      await load();
    } catch (e) {
      console.error(e);
      alert("Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete location?")) return;
    try {
      await Api.delete(`/admin/settings/locations/${id}`);
      await load();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading />;

  // simple grouping by parent
  const byParent = items.reduce<Record<string, Location[]>>((acc, cur) => {
    const pid = cur.parentId ?? "root";
    acc[pid] = acc[pid] ?? [];
    acc[pid].push(cur);
    return acc;
  }, {});

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <SectionHeader title="Locations" subtitle="Manage service areas and hierarchy." />

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          placeholder="Name"
          className="border p-2 rounded col-span-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="country">Country</option>
          <option value="city">City</option>
          <option value="town">Town</option>
          <option value="neighborhood">Neighborhood</option>
        </select>

        <select
          className="border p-2 rounded col-span-3"
          value={form.parentId}
          onChange={(e) => setForm({ ...form, parentId: e.target.value })}
        >
          <option value="">— no parent —</option>
          {items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.type ?? "loc"}: {it.name}
            </option>
          ))}
        </select>

        <div className="col-span-3 flex justify-end">
          <button
            onClick={create}
            disabled={creating}
            className={`px-4 py-2 rounded ${creating ? "bg-gray-400" : "bg-green-600 text-white"}`}
          >
            {creating ? "Creating..." : "Create location"}
          </button>
        </div>
      </div>

      <div>
        {(byParent["root"] || []).map((country) => (
          <div key={country.id} className="mb-3 border-l pl-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{country.name}</div>
                <div className="text-xs text-gray-500">country</div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => remove(country.id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-2 pl-4">
              {(byParent[country.id] || []).map((city) => (
                <div key={city.id} className="mb-2 border-l pl-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-xs text-gray-500">city</div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => remove(city.id)} className="text-red-600">
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 pl-4">
                    {(byParent[city.id] || []).map((town) => (
                      <div key={town.id} className="mb-2 border-l pl-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div>{town.name}</div>
                            <div className="text-xs text-gray-500">town</div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => remove(town.id)} className="text-red-600">
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 pl-4">
                          {(byParent[town.id] || []).map((nb) => (
                            <div key={nb.id} className="flex justify-between items-center py-1">
                              <div>
                                <div>{nb.name}</div>
                                <div className="text-xs text-gray-500">neighborhood</div>
                              </div>
                              <div>
                                <button onClick={() => remove(nb.id)} className="text-red-600">
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {items.length === 0 && <div className="text-gray-500">No locations yet.</div>}
      </div>
    </div>
  );
}
