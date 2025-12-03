"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterForm() {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    const ok = await register({ firstName, lastName, email, password });

    if (!ok) alert("Registration failed");

    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-5 bg-white p-6 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Create your account</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="border p-2 rounded-lg"/>
        <input placeholder="Middle name (optional)" value={middleName} onChange={e => setMiddleName(e.target.value)} className="border p-2 rounded-lg"/>
        <div className="col-span-2">
          <input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required className="border p-2 rounded-lg w-full"/>
        </div>
      </div>

      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required className="border p-2 rounded-lg w-full"/>
      <input type="email" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded-lg w-full"/>

      <div className="relative">
        <input type={show ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="border p-2 rounded-lg w-full pr-10"/>
        <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-2 text-gray-500">
          {show ? <FiEyeOff/> : <FiEye/>}
        </button>
      </div>

      <input type={show ? "text" : "password"} placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="border p-2 rounded-lg w-full"/>

      <button disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg">{loading ? "Creating..." : "Sign Up"}</button>
    </form>
  );
}
