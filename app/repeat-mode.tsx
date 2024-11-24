"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Repeat, Repeat1 } from "lucide-react";
import { usePlayback } from "@/app/playback-context";

type RepeatMode = "none" | "all" | "one";

const RepeatMode = () => {
    const { repeatMode, setRepeatMode } = usePlayback();

    const repeatModes: RepeatMode[] = ["none", "all", "one"];

    const toggleRepeatMode = () => {
        const currentIndex = repeatModes.indexOf(repeatMode);
        const nextIndex = (currentIndex + 1) % repeatModes.length;
        setRepeatMode(repeatModes[nextIndex]);
    };

    const renderButton = () => {
        switch (repeatMode) {
            case "all":
                return (
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={toggleRepeatMode}
                    >
                        <Repeat className="w-4 h-4 stroke-[1.5]" />
                    </Button>
                );
            case "one":
                return (
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={toggleRepeatMode}
                    >
                        <Repeat1 className="w-4 h-4 stroke-[1.5]" />
                    </Button>
                );
            case "none":
            default:
                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={toggleRepeatMode}
                    >
                        <Repeat className="w-4 h-4 stroke-[1.5]" />
                    </Button>
                );
        }
    };

    return <>{renderButton()}</>;
};

export default RepeatMode;