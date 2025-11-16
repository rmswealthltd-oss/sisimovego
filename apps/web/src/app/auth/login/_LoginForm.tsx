// apps/web/src/app/auth/login/_LoginForm.tsx
"use client";
import { useState } from "react";
import { Api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    try {
      await Api.post("/auth/login", { email, password });
      // server should set cookies; refresh to ensure auth state is updated
      router.push("/profile");
    } catch (err:any) {
      alert(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
      <div>
        <label className="text-sm block mb-1">Email</label>
        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="text-sm block mb-1">Password</label>
        <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>

      <div className="flex items-center justify-between">
        <button disabled={loading} className="px-4 py-2 bg-primary text-white rounded">{loading ? "Signing in..." : "Sign in"}</button>
        <a href="/auth/register" className="text-sm text-primary">Create account</a>
      </div>
    </form>
  );
}
