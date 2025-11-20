// apps/web/src/app/auth/register/_RegisterForm.tsx
"use client";
import React from "react";

import { useState,} from "react";
import { Api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const router = useRouter();

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    try {
      await Api.post("/auth/register", { name, email, phone, password });
      router.push("/auth/login");
    } catch (err:any) {
      alert(err?.message || "Registration failed");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
      <div>
        <label className="text-sm block mb-1">Full name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <label className="text-sm block mb-1">Phone</label>
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <label className="text-sm block mb-1">Email</label>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <label className="text-sm block mb-1">Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <button disabled={loading} className="px-4 py-2 bg-primary text-white rounded">{loading ? "Creating..." : "Create account"}</button>
      </div>
    </form>
  );
}
