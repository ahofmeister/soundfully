"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayback } from "@/app/playback-context";
import RepeatMode from "@/app/repeat-mode";

export function TrackInfo() {
  let { currentTrack } = usePlayback();

  return (
    <div className="flex items-center px-3">
      {currentTrack && (
        <>
          <div>
            <div className="text-sm font-medium truncate text-white/90">
              {currentTrack.title}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTrack.artist}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function PlaybackButtons() {
  let {
    isPlaying,
    togglePlayPause,
    playPreviousTrack,
    playNextTrack,
    setRepeatMode,
    currentTrack,
    repeatMode,
  } = usePlayback();

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={playPreviousTrack}
        disabled={!currentTrack}
      >
        <SkipBack className="size-6 stroke-[1.5]" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-10"
        onClick={togglePlayPause}
        disabled={!currentTrack}
      >
        {isPlaying ? (
          <Pause className="size-6 stroke-[1.5]" />
        ) : (
          <Play className="size-6 stroke-[1.5]" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={playNextTrack}
        disabled={!currentTrack}
      >
        <SkipForward className="size-6 stroke-[1.5]" />
      </Button>
      <RepeatMode />
    </div>
  );
}

export function ProgressBar() {
  let { currentTime, duration, audioRef, setCurrentTime } = usePlayback();
  let progressBarRef = useRef<HTMLDivElement>(null);

  let formatTime = (time: number) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  let handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      let rect = progressBarRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      let newTime = (percentage / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <>
      <div className="flex max-w-96 items-center justify-center mx-auto">
        <div
          ref={progressBarRef}
          className="flex-grow mx-2 h-1 bg-[#3E3E3E] rounded-full cursor-pointer relative"
          onClick={handleProgressChange}
        >
          <div
            className="absolute top-0 left-0 h-full bg-white rounded-full"
            style={{
              width: `${(currentTime / duration) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <div className={"flex justify-between p-2 mx-auto max-w-96"}>
        <span className="text-xs tabular-nums text-gray-400">
          {formatTime(currentTime)}
        </span>
        <span className="text-xs tabular-nums text-gray-400">
          {formatTime(duration)}
        </span>
      </div>
    </>
  );
}

export function Volume() {
  let { audioRef, currentTrack } = usePlayback();
  let [volume, setVolume] = useState(100);
  let [isMuted, setIsMuted] = useState(false);
  let [isVolumeVisible, setIsVolumeVisible] = useState(false);
  let volumeBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, audioRef]);

  let handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (volumeBarRef.current) {
      let rect = volumeBarRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setVolume(percentage);
      if (audioRef.current) {
        audioRef.current.volume = percentage / 100;
      }
      setIsMuted(percentage === 0);
    }
  };

  let toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  let toggleVolumeVisibility = () => {
    setIsVolumeVisible(!isVolumeVisible);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          toggleMute();
          toggleVolumeVisibility();
        }}
        disabled={!currentTrack}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-gray-400" />
        ) : (
          <Volume2 className="w-4 h-4 text-gray-400" />
        )}
      </Button>
      {isVolumeVisible && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-[#282828] rounded-md shadow-lg">
          <div
            ref={volumeBarRef}
            className="w-20 h-1 bg-[#3E3E3E] rounded-full cursor-pointer relative"
            onClick={handleVolumeChange}
          >
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{ width: `${volume}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlaybackControls() {
  let {
    currentTrack,
    audioRef,
    setCurrentTime,
    setDuration,
    playPreviousTrack,
    playNextTrack,
    togglePlayPause,
  } = usePlayback();

  useEffect(() => {
    let audio = audioRef.current;
    if (audio) {
      let updateTime = () => setCurrentTime(audio!.currentTime);
      let updateDuration = () => setDuration(audio!.duration);

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);

      return () => {
        audio!.removeEventListener("timeupdate", updateTime);
        audio!.removeEventListener("loadedmetadata", updateDuration);
      };
    }
  }, [audioRef, setCurrentTime, setDuration]);

  useEffect(() => {
    if ("mediaSession" in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || undefined,
        artwork: [{ src: "/artwork.png", sizes: "512x512", type: "image/png" }],
      });

      console.log(navigator.mediaSession.metadata.artwork);
      navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current?.play();
        togglePlayPause();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current?.pause();
        togglePlayPause();
      });

      navigator.mediaSession.setActionHandler(
        "previoustrack",
        playPreviousTrack,
      );
      navigator.mediaSession.setActionHandler("nexttrack", playNextTrack);

      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (audioRef.current && details.seekTime !== undefined) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      });

      const updatePositionState = () => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          try {
            navigator.mediaSession.setPositionState({
              duration: audioRef.current.duration,
              playbackRate: audioRef.current.playbackRate,
              position: audioRef.current.currentTime,
            });
          } catch (error) {
            console.error("Error updating position state:", error);
          }
        }
      };

      const handleLoadedMetadata = () => {
        updatePositionState();
      };

      audioRef.current?.addEventListener("timeupdate", updatePositionState);
      audioRef.current?.addEventListener(
        "loadedmetadata",
        handleLoadedMetadata,
      );

      return () => {
        audioRef.current?.removeEventListener(
          "timeupdate",
          updatePositionState,
        );
        audioRef.current?.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata,
        );
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("seekto", null);
      };
    }
  }, [
    currentTrack,
    playPreviousTrack,
    playNextTrack,
    togglePlayPause,
    audioRef,
    setCurrentTime,
  ]);

  return (
    <div
      className={
        "pt-2 fixed bottom-0 left-0 right-0 playlist-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:pb-[calc(0.5rem+env(safe-area-inset-bottom))] bg-[#181818] border-t border-[#282828]"
      }
    >
      <TrackInfo />
      <div className={"mt-2"}>
        <ProgressBar />
      </div>

      <div className="flex items-center justify-between">
        <audio ref={audioRef} />
        <div className="flex-1 flex items-center justify-center">
          <PlaybackButtons />
        </div>
        <div className="ml-auto">
          <Volume />
        </div>
      </div>
    </div>
  );
}
