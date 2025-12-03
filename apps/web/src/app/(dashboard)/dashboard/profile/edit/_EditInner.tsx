// apps/web/src/app/profile/edit/_EditInner.tsx
"use client";
import { useState } from "react";
import { Api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EditInner({ serverUser }: { serverUser: any }) {
  const [form, setForm] = useState({ name: serverUser?.name ?? "", phone: serverUser?.phone ?? "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function save() {
    setLoading(true);
    try {
      await Api.post("/auth/me/update", form);
      router.refresh();
      alert("Saved");
    } catch (e:any) {
      alert(e?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow mt-4 space-y-3">
      <label className="text-sm">Full name</label>
      <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full border p-2 rounded"/>
      <label className="text-sm">Phone</label>
      <input value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} className="w-full border p-2 rounded"/>
      <div className="pt-2">
        <button disabled={loading} onClick={save} className="px-4 py-2 bg-primary text-white rounded">{loading? "Saving...":"Save"}</button>
      </div>
    </div>
  );
}
