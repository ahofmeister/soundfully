"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export const getOrCreateDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};

const updateDeviceInfo = async (userId: string) => {
  const supabase = createClient();
  await supabase.from("device").upsert({
    user_id: userId,
    device_id: getOrCreateDeviceId(),
    device_name: navigator.userAgent,
    last_active: new Date().toISOString(),
  });
};

export default function DeviceTracker() {
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        await updateDeviceInfo(user.id);
      }
    };

    fetchUser();
  }, []);

  return null; // No UI needed, just tracking
}
