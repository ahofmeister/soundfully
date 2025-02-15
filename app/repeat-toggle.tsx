"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Repeat, Repeat1 } from "lucide-react";
import { usePlayback } from "@/app/playback-context";

const RepeatToggle = () => {
  const { repeat, setRepeat } = usePlayback();

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleRepeat}>
      {repeat ? (
        <Repeat1 className="size-6 stroke-[1.5]" />
      ) : (
        <Repeat className="size-6 stroke-[1.5]" />
      )}
    </Button>
  );
};
export default RepeatToggle;
