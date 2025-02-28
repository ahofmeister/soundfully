"use client";
import { useDeviceStore } from "@/components/device/device-store";
import { createClient } from "@/utils/supabase/client";
import { clsx } from "clsx";

const DeviceSwitcher = () => {
  const { devices } = useDeviceStore();

  const switchDevice = async (deviceId: string) => {
    const supabase = createClient();
    await supabase.from("device").update({ active: false }).neq("id", deviceId);
    await supabase.from("device").update({ active: true }).eq("id", deviceId);
  };

  return (
    <div className={"flex gap-x-2"}>
      {devices.map((device) => (
        <div
          onClick={async () => {
            if (!device?.active) {
              switchDevice(device.id);
            }
          }}
          key={device.id}
          className={clsx("text-xs", device?.active && "text-green-500")}
        >
          {device.device_name}
        </div>
      ))}
    </div>
  );
};

export default DeviceSwitcher;
