import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      toast.show({ type: "error", message: "Please enter email and password" });
      return;
    }

    setBusy(true);

try {
  await login(email, password);
  toast.show({ type: "success", message: "Signed in" });

  const from = location.state?.from?.pathname;
  const dest = from && from.startsWith("/admin") ? from : "/admin";

  navigate(dest, { replace: true });
} catch (err) {
  toast.show({
    type: "error",
    message: err?.data?.message || err?.message || "Login failed",
  });
} finally {
  setBusy(false);
}

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary text-white w-12 h-12 rounded-md flex items-center justify-center text-lg font-bold">
            SM
          </div>
          <div>
            <h1 className="text-xl font-semibold">SisiMove Admin</h1>
            <p className="text-xs text-gray-500">Africa-first ridesharing — admin console</p>
          </div>
        </div>

        <PageTitle>Sign in</PageTitle>

        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <label className="block">
            <span className="text-sm mb-1 block">Email</span>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </label>

          <label className="block">
            <span className="text-sm mb-1 block">Password</span>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            disabled={busy}
            className="w-full py-2 rounded bg-primary text-white disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
