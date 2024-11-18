import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SongStore = {
    currentTrack: string;
    setCurrentTrack: (currentTrack: string) => void;
};

const useTrackStore = create<SongStore>()(
    persist(
        (set) => ({
            currentTrack: '',
            setCurrentTrack: (currentTrack) => set({ currentTrack }),
        }),
        {
            name: 'song-storage',
        }
    )
);

export default useTrackStore;
