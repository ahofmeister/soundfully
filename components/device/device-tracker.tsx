"use client";
import { useEffect } from "react";
import {
  subscribeToDevices,
  updateDeviceInfo,
} from "@/components/device/device-store";

const DeviceSync = (props: { userId: string }) => {
  useEffect(() => {
    const unsubscribe = subscribeToDevices();
    void updateDeviceInfo(props.userId);

    return () => {
      void unsubscribe.unsubscribe(1);
    };
  }, []);

  return null;
};

export default DeviceSync;
