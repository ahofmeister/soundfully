import {Button} from '@/components/ui/button';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {ChevronLeft, ChevronRight, Shuffle} from 'lucide-react';
import Link from 'next/link';
import {createClient} from "@/utils/supabase/server";
import {PlaylistWithSongs} from "@/utils/supabase/types";
import {TrackTable} from "@/app/track-table";
import {notFound} from "next/navigation";
import {formatDuration} from "@/lib/utils";
import {EditableTitle} from "@/app/p/[id]/editable-title";

export default async function PlaylistPage({
                                               params,
                                           }: {
    params: Promise<{ id: string }>;
}) {
    let id = (await params).id;
    let {
        data,
        error
    } = await createClient().from("playlist").select("*, songs:playlist_song(song(*))").eq("id", id)
        .single<PlaylistWithSongs>()

    const playlist = {
        ...data,
        songs: data?.songs.map(playlistSong => ({...playlistSong.song})),
        duration: data?.songs.reduce((sum, x) => sum + (x.song.duration || 0), 0),
        trackCount: data?.songs.length || 0
    };

    if (!playlist) {
        notFound();
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] pb-[69px]">
            {error?.message}
            <div className="flex items-center justify-between p-3 bg-[#0A0A0A]">
                <div className="flex items-center space-x-1">
                    <Link href="/" passHref>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ChevronLeft className="w-4 h-4"/>
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                        <ChevronRight className="w-4 h-4"/>
                    </Button>
                    <span className="text-sm">{playlist.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="secondary"
                        className="h-7 text-xs bg-[#282828] hover:bg-[#3E3E3E] text-white"
                    >
                        Play All
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Shuffle className="w-4 h-4"/>
                    </Button>
                </div>
            </div>

            <div className="flex items-center py-3 px-4 space-x-3 bg-[#0A0A0A]">
                <div>
                    <EditableTitle playlistId={playlist.id!} initialName={playlist.name!}/>
                    <p className="text-xs sm:text-sm text-gray-400">
                        {playlist.trackCount} tracks • {formatDuration(playlist.duration!)}
                    </p>
                </div>
            </div>
            <ScrollArea className="flex-1 mt-3">
                <div className="min-w-max">
                    <TrackTable playlist={playlist.songs ?? []}/>
                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </div>
    );
}
