"use client"
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import {Song} from "@/utils/supabase/types";
import {createClient} from "@/utils/supabase/client";
import {it} from "node:test";

type Panel = 'sidebar' | 'tracklist';

type PlaybackContextType = {
    isPlaying: boolean;
    currentTrack: Song | null;
    currentTime: number;
    duration: number;
    togglePlayPause: () => void;
    playTrack: (track: Song) => void;
    playNextTrack: () => void;
    playPreviousTrack: () => void;
    repeatTrack: () => void;
    repeat: boolean
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setPlaylist: (songs: Song[]) => void;
    audioRef: React.RefObject<HTMLAudioElement>;
    activePanel: Panel;
    setActivePanel: (panel: Panel) => void;
    registerPanelRef: (panel: Panel, ref: React.RefObject<HTMLElement>) => void;
    handleKeyNavigation: (e: React.KeyboardEvent, panel: Panel) => void;
};

const PlaybackContext = createContext<PlaybackContextType | undefined>(
    undefined
);

function useKeyboardNavigation() {
    const [activePanel, setActivePanel] = useState<Panel>('sidebar');
    const panelRefs = useRef<Record<Panel, React.RefObject<HTMLElement> | null>>({
        sidebar: null,
        tracklist: null,
    });

    const registerPanelRef = useCallback(
        (panel: Panel, ref: React.RefObject<HTMLElement>) => {
            panelRefs.current[panel] = ref;
        },
        []
    );

    const handleKeyNavigation = useCallback(
        (e: React.KeyboardEvent, panel: Panel) => {
            const currentRef = panelRefs.current[panel];
            console.log(currentRef)
            if (!currentRef?.current) return;

            const items = Array.from(
                currentRef.current.querySelectorAll('[tabindex="0"]')
            );


            const currentIndex = items.indexOf(document.activeElement as HTMLElement);

            switch (e.key) {
                case 'ArrowDown':
                case 'j':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % items.length;
                    (items[nextIndex] as HTMLElement).focus();
                    break;
                case 'ArrowUp':
                case 'k':
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + items.length) % items.length;
                    (items[prevIndex] as HTMLElement).focus();
                    break;
                case 'h':
                    if (panel === 'tracklist') {
                        e.preventDefault();
                        setActivePanel('sidebar');
                        const sidebarFirstItem =
                            panelRefs.current.sidebar?.current?.querySelector(
                                '[tabindex="0"]'
                            ) as HTMLElement | null;
                        sidebarFirstItem?.focus();
                    }
                    break;
                case 'l':
                    if (panel === 'sidebar') {
                        e.preventDefault();
                        setActivePanel('tracklist');
                        const tracklistFirstItem =
                            panelRefs.current.tracklist?.current?.querySelector(
                                '[tabindex="0"]'
                            ) as HTMLElement | null;
                        tracklistFirstItem?.focus();
                    }
                    break;
            }
        },
        []
    );

    return {activePanel, setActivePanel, registerPanelRef, handleKeyNavigation};
}

export function PlaybackProvider({children}: { children: ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [repeat, setRepeat] = useState(false)


    const {activePanel, setActivePanel, registerPanelRef, handleKeyNavigation} =
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
    }, [isPlaying]);

    const repeatTrack = useCallback(() => {
        if (audioRef.current) {
            let repeat = !audioRef.current.loop;
            audioRef.current.loop = repeat;
            setRepeat(repeat)
        }
    }, [])

    const playTrack = useCallback(
        (track: Song) => {
            setCurrentTrack(track);
            setIsPlaying(true);
            setCurrentTime(0);
            if (audioRef.current) {
                audioRef.current.src = createClient().storage.from("songs").getPublicUrl(track.path).data.publicUrl
                audioRef.current.play();
            }
        },
        [activePanel]
    );

    const playNextTrack = useCallback(() => {
        if (currentTrack && playlist.length > 0) {
            const currentIndex = playlist.findIndex(
                (track) => track.id === currentTrack.id
            );
            const nextIndex = (currentIndex + 1) % playlist.length;
            playTrack(playlist[nextIndex]);
        }
    }, [currentTrack, playlist, playTrack]);

    const playPreviousTrack = useCallback(() => {
        if (currentTrack && playlist.length > 0) {
            const currentIndex = playlist.findIndex(
                (track) => track.id === currentTrack.id
            );
            const previousIndex =
                (currentIndex - 1 + playlist.length) % playlist.length;
            playTrack(playlist[previousIndex]);
        }
    }, [currentTrack, playlist, playTrack]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                togglePlayPause();
            }
                // else if (e.key === 'm' && e.target === document.body) {
                //     e.preventDefault();
                //     mute()
            // }
            else if (e.key === 'ArrowLeft' && e.metaKey) {
                e.preventDefault();
                playPreviousTrack()
            } else if (e.key === 'ArrowRight' && e.metaKey) {
                e.preventDefault();
                playNextTrack()
            }

        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            console.log("YO")
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [togglePlayPause, playNextTrack, playPreviousTrack]);

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
                repeatTrack,
                setCurrentTime,
                setDuration,
                setPlaylist,
                audioRef,
                activePanel,
                setActivePanel,
                registerPanelRef,
                handleKeyNavigation,
                repeat
            }}
        >
            {children}
        </PlaybackContext.Provider>
    );
}

export function usePlayback() {
    const context = useContext(PlaybackContext);
    if (context === undefined) {
        throw new Error('usePlayback must be used within a PlaybackProvider');
    }
    return context;
}
