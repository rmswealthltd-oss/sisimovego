import { useEffect, useState } from "react";
import axios from "../lib/axios";

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/system/config/settings").then((res) => {
      setSettings(
        Object.fromEntries(res.data.map((s) => [s.key, s.value]))
      );
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
