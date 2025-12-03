// apps/web/src/app/auth/login/_LoginForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginForm() {
  const { login, token } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("dev@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (token) {
      router.replace("/dashboard"); // Redirect if already logged in
    }
  }, [token, router]);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) setErrorMsg("Invalid email or password");
    } catch (err: any) {
      setErrorMsg(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 bg-white p-6 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome back</h2>

      {errorMsg && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded">
          {errorMsg}
        </p>
      )}

      <div>
        <label className="text-sm font-medium block mb-1">Email</label>
        <input
          type="email"
          required
          placeholder="dev@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition disabled:bg-gray-400"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a href="/auth/register" className="text-primary underline">
          Register
        </a>
      </p>
    </form>
  );
}
