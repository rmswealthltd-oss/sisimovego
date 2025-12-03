"use client";

import { useState } from "react";

export default function NotificationSettingsForm() {
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [inApp, setInApp] = useState(true);

  const handleSave = async () => {
    await fetch("/api/notifications/settings", {
      method: "POST",
      body: JSON.stringify({ email, sms, inApp }),
    });

    alert("Settings updated.");
  };

  return (
    <div className="space-y-6">
      <label className="flex items-center justify-between">
        <span>Email Notifications</span>
        <input
          type="checkbox"
          checked={email}
          onChange={(e) => setEmail(e.target.checked)}
          className="toggle-checkbox"
        />
      </label>

      <label className="flex items-center justify-between">
        <span>SMS Notifications</span>
        <input
          type="checkbox"
          checked={sms}
          onChange={(e) => setSms(e.target.checked)}
          className="toggle-checkbox"
        />
      </label>

      <label className="flex items-center justify-between">
        <span>In-App Notifications</span>
        <input
          type="checkbox"
          checked={inApp}
          onChange={(e) => setInApp(e.target.checked)}
          className="toggle-checkbox"
        />
      </label>

      <button
        onClick={handleSave}
        className="bg-primary text-white px-5 py-2 rounded-xl"
      >
        Save Preferences
      </button>
    </div>
  );
}
