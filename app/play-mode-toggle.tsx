"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Repeat1, Shuffle } from "lucide-react";
import { usePlayback } from "@/app/playback-context";

const PlayModeToggle = () => {
  const { playMode, setPlayMode } = usePlayback();

  const toggleRepeat = () => {
    switch (playMode) {
      case "shuffle":
        setPlayMode("repeat_one");
        break;
      case "repeat_one":
        setPlayMode("shuffle");
        break;
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleRepeat}>
      {playMode === "repeat_one" ? (
        <Repeat1 className="size-6 stroke-[1.5]" />
      ) : (
        <Shuffle className="size-6 stroke-[1.5]" />
      )}
    </Button>
  );
};
export default PlayModeToggle;
