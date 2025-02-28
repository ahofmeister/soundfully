"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { usePlayback } from "@/app/playback-context";

const ShuffleToggle = () => {
  const { shuffle, setShuffle } = usePlayback();

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleShuffle}
      className={shuffle ? "text-primary" : "text-muted-foreground"}
    >
      <Shuffle className="size-6 stroke-[1.5]" />
    </Button>
  );
};

export default ShuffleToggle;
