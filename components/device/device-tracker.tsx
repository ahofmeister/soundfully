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

const getDeviceType = (): string => {
  if (typeof navigator === "undefined") {
    return "unknown";
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const hasTouch = navigator.maxTouchPoints > 1;
  const isPWA =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "iOS";
  }

  if (/android/.test(userAgent)) {
    return "Android";
  }

  if (/windows/.test(userAgent)) {
    return "Windows";
  }

  if (/linux/.test(userAgent)) {
    return "Linux";
  }

  if (/macintosh|mac os x/.test(userAgent)) {
    return hasTouch
      ? "iPad (iOS)"
      : isPWA
        ? "MacBook (App)"
        : "MacBook (Browser)";
  }

  return isPWA ? "PWA (Browser)" : "Browser";
};

const updateDevice = async (userId: string) => {
  const supabase = createClient();
  await supabase.from("device").upsert({
    user_id: userId,
    id: getOrCreateDeviceId(),
    device_name: getDeviceType(),
    last_active: new Date().toISOString(),
  });
};

export default function DeviceTracker() {
  useEffect(() => {
    const fetchUserAndUpdateDevice = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        await updateDevice(user.id);
      }
    };

    fetchUserAndUpdateDevice();
  }, []);

  return null;
}
