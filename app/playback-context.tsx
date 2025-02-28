"use client";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FullPlayback, Playback, Song } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/client";
import {
  getOrCreateDeviceId,
  useDeviceStore,
} from "@/components/device/device-store";

type Panel = "sidebar" | "tracklist";

type PlaybackContextType = {
  isPlaying: boolean;
  currentTrack: Song | null;
  currentTime: number;
  duration: number;
  togglePlayPause: () => void;
  playTrack: (track: Song) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  setRepeat: (repeat: boolean) => void;
  repeat: boolean;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaylist: (songs: Song[]) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  activePanel: Panel;
  setActivePanel: (panel: Panel) => void;
  registerPanelRef: (panel: Panel, ref: React.RefObject<HTMLElement>) => void;
  handleKeyNavigation: (e: React.KeyboardEvent, panel: Panel) => void;
  savePlayback: (song: Song | null, playing: boolean) => void;
};

const PlaybackContext = createContext<PlaybackContextType | undefined>(
  undefined,
);

function useKeyboardNavigation() {
  const [activePanel, setActivePanel] = useState<Panel>("sidebar");
  const panelRefs = useRef<Record<Panel, React.RefObject<HTMLElement> | null>>({
    sidebar: null,
    tracklist: null,
  });

  const registerPanelRef = useCallback(
    (panel: Panel, ref: React.RefObject<HTMLElement>) => {
      panelRefs.current[panel] = ref;
    },
    [],
  );

  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent, panel: Panel) => {
      const currentRef = panelRefs.current[panel];
      if (!currentRef?.current) return;

      const items = Array.from(
        currentRef.current.querySelectorAll('[tabindex="0"]'),
      );

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);

      switch (e.key) {
        case "ArrowDown":
        case "j":
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          (items[nextIndex] as HTMLElement).focus();
          break;
        case "ArrowUp":
        case "k":
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          (items[prevIndex] as HTMLElement).focus();
          break;
        case "h":
          if (panel === "tracklist") {
            e.preventDefault();
            setActivePanel("sidebar");
            const sidebarFirstItem =
              panelRefs.current.sidebar?.current?.querySelector(
                '[tabindex="0"]',
              ) as HTMLElement | null;
            sidebarFirstItem?.focus();
          }
          break;
        case "l":
          if (panel === "sidebar") {
            e.preventDefault();
            setActivePanel("tracklist");
            const tracklistFirstItem =
              panelRefs.current.tracklist?.current?.querySelector(
                '[tabindex="0"]',
              ) as HTMLElement | null;
            tracklistFirstItem?.focus();
          }
          break;
      }
    },
    [],
  );

  return { activePanel, setActivePanel, registerPanelRef, handleKeyNavigation };
}

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [repeat, setRepeat] = useState<boolean>(false);

  const { devices } = useDeviceStore();

  const { activePanel, setActivePanel, registerPanelRef, handleKeyNavigation } =
    useKeyboardNavigation();

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
    void savePlayback(currentTrack, !isPlaying);
  }, [isPlaying]);

  const playTrack = useCallback(
    (track: Song) => {
      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.src = createClient()
          .storage.from("songs")
          .getPublicUrl(track.path).data.publicUrl;
        audioRef.current.play();
        void savePlayback(track, isPlaying);
      }
    },
    [activePanel],
  );

  const savePlayback = async (song: Song | null, playing: boolean) => {
    if (song && audioRef.current) {
      const supabase = createClient();

      const activeDevice = devices.filter((x) => x.active)[0];
      const { error } = await supabase.from("playback").upsert(
        {
          song_id: song.id,
          playback_time: audioRef.current.currentTime,
          repeat: repeat,
          playing: playing,
          device_id: activeDevice.id,
        },
        { onConflict: "user_id" },
      );

      if (error) {
        console.log(error);
      }
    }
  };

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (isPlaying) {
  //       void savePlayback(currentTrack, true);
  //     }
  //   }, 2 * 1000);
  //
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [currentTrack, repeat, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = repeat;
    }
    void savePlayback(currentTrack, isPlaying);
  }, [repeat]);

  const playNextTrack = useCallback(() => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (track) => track.id === currentTrack.id,
      );
      const nextIndex = (currentIndex + 1) % playlist.length;
      playTrack(playlist[nextIndex]);
    }
  }, [currentTrack, playlist, playTrack]);

  const playPreviousTrack = useCallback(() => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (track) => track.id === currentTrack.id,
      );
      const previousIndex =
        (currentIndex - 1 + playlist.length) % playlist.length;
      playTrack(playlist[previousIndex]);
    }
  }, [currentTrack, playlist, playTrack]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTrackEnd = () => {
      if (repeat) {
        audio?.play();
      } else {
        playNextTrack();
      }
    };

    if (audio) {
      audio.addEventListener("ended", handleTrackEnd);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("ended", handleTrackEnd);
      }
    };
  }, [repeat, playNextTrack]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        togglePlayPause();
      }
      // else if (e.key === 'm' && e.target === document.body) {
      //     e.preventDefault();
      //     mute()
      // }
      else if (e.key === "ArrowLeft" && e.metaKey) {
        e.preventDefault();
        playPreviousTrack();
      } else if (e.key === "ArrowRight" && e.metaKey) {
        e.preventDefault();
        playNextTrack();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [togglePlayPause, playNextTrack, playPreviousTrack]);

  useEffect(() => {
    async function findCurrentTrack() {
      let supabase = createClient();
      const { data } = await supabase
        .from("playback")
        .select("*, song(*)")
        .maybeSingle<FullPlayback>();

      supabase
        .channel("playback")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "playback" },
          (event) => {
            let updatedPlayback = event.new as Playback;
            let isPlaying = updatedPlayback.playing;
            setIsPlaying(isPlaying);

            if (getOrCreateDeviceId() === updatedPlayback.device_id) {
              console.log("CURRENT");
            } else {
              console.log("NO");
              console.log(updatedPlayback.device_id);
            }

            if (isPlaying) {
              audioRef.current?.play();
            } else {
              audioRef.current?.pause();
            }

            setRepeat(updatedPlayback.repeat);
            // console.log("event.new", event.new);
            // setCurrentTime(event.new.playback_time);
            // }
          },
        )
        .subscribe();
      //
      if (data) {
        setRepeat(data.repeat);
        setCurrentTrack(data.song);
        if (audioRef && audioRef.current) {
          audioRef.current.src = createClient()
            .storage.from("songs")
            .getPublicUrl(data.song.path).data.publicUrl;
          audioRef.current.currentTime = data.playback_time;
          setIsPlaying(data.playing);
          audioRef.current.loop = data?.repeat;
        }
      }
    }

    void findCurrentTrack();
  }, []);

  return (
    <PlaybackContext.Provider
      value={{
        isPlaying,
        currentTrack,
        currentTime,
        duration,
        togglePlayPause,
        playTrack,
        playNextTrack,
        playPreviousTrack,
        setRepeat,
        setCurrentTime,
        setDuration,
        setPlaylist,
        audioRef,
        activePanel,
        setActivePanel,
        registerPanelRef,
        handleKeyNavigation,
        repeat,
        savePlayback,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (context === undefined) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
}
