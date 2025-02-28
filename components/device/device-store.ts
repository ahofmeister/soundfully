import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import { Device } from "@/utils/supabase/types";

interface DeviceState {
  devices: Device[];
  setDevices: (devices: Device[]) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  devices: [],
  setDevices: (devices) => set({ devices }),
}));

const getOrCreateDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};

export const updateDeviceInfo = async (userId: string) => {
  const deviceId = getOrCreateDeviceId();

  const supabase = createClient();

  const { data } = await supabase.from("device").select("*");

  if (data) {
    useDeviceStore.getState().setDevices(data ?? []);
  }

  if (!data || data.find((d) => d.id === deviceId) === undefined) {
    await supabase.from("device").upsert({
      id: deviceId,
      user_id: userId,
      device_name: getDeviceType(),
    });
  }
};

export const subscribeToDevices = () => {
  const supabase = createClient();
  return supabase
    .channel("realtime:devices")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "device" },
      (payload) => {
        if (!payload.new) {
          return;
        }
        const newDevice = payload.new as Device;

        const { devices, setDevices } = useDeviceStore.getState();

        const updatedDevices = [
          ...devices.filter((d) => d.id !== newDevice.id),
          newDevice,
        ];

        setDevices(updatedDevices);
      },
    )
    .subscribe();
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
