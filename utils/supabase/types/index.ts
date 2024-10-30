import {Database} from "@/utils/supabase/types/schema";

export type Song = Database["public"]["Tables"]["song"]["Row"];
export type NewSong = Database["public"]["Tables"]["song"]["Insert"];
export type Playlist = Database["public"]["Tables"]["playlist"]["Row"];
export type PlaylistSong = Database["public"]["Tables"]["playlist_song"]["Row"] & {
    song: Song
}
export type PlaylistWithSongs = Database["public"]["Tables"]["playlist"]["Row"] & {
    songs: PlaylistSong[]
    duration: number
    trackCount: number
}