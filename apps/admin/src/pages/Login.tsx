import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.show({ type: "error", message: "Please enter email and password" });
      return;
    }
    setBusy(true);
    try {
      await login(email, password);
      toast.show({ type: "success", message: "Signed in" });
      const dest = (loc.state as any)?.from?.pathname || "/";
      nav(dest, { replace: true });
    } catch (err: any) {
      console.error(err);
      toast.show({ type: "error", message: err?.data?.message || err?.message || "Login failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-sky-50 to-sky-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary text-white w-12 h-12 rounded-md flex items-center justify-center text-lg">SM</div>
          <div>
            <h1 className="text-xl font-bold">SisiMove Admin</h1>
            <div className="text-xs text-gray-500">Africa-first ridesharing — admin console</div>
          </div>
        </div>

        <PageTitle>Sign in</PageTitle>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <div className="text-sm mb-1">Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="you@company.com"
              autoFocus
            />
          </label>

          <label className="block">
            <div className="text-sm mb-1">Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="••••••••"
            />
          </label>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border" />
              <span>Remember me</span>
            </label>

            <a className="text-blue-600" href="#">Forgot?</a>
          </div>

          <div>
            <button disabled={busy} className="w-full py-2 rounded bg-primary text-white">
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
