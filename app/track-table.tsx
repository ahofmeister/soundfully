'use client';

import {usePlayback} from '@/app/playback-context';
import React, {useEffect, useRef, useState} from 'react';
import {Button} from '@/components/ui/button';
import {MoreHorizontal, Pause, Play, Plus} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Song} from "@/utils/supabase/types";
import {formatDuration} from "@/lib/utils";
import {cn} from "@/utils/cn";

function TrackRow({
                      track,
                      index,
                      isSelected,
                      onSelect,
                  }: {
    track: Song;
    index: number;
    query?: string;
    isSelected: boolean;
    onSelect: () => void;
}) {
    let {
        currentTrack,
        playTrack,
        togglePlayPause,
        isPlaying,
        setActivePanel,
        handleKeyNavigation,
    } = usePlayback();
    // let { playlists } = usePlaylist();

    let [isFocused, setIsFocused] = useState(false);
    let isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
    let isCurrentTrack = currentTrack?.id === track?.id;


    function onClickTrackRow(e: React.MouseEvent) {
        e.preventDefault();
        setActivePanel('tracklist');
        onSelect();
        if (isCurrentTrack) {
            togglePlayPause();
        } else {
            playTrack(track);
        }
    }

    function onKeyDownTrackRow(e: React.KeyboardEvent<HTMLTableRowElement>) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
            if (isCurrentTrack) {
                togglePlayPause();
            } else {
                playTrack(track);
            }
        } else {
            handleKeyNavigation(e, 'tracklist');
        }
    }

    return (
        <tr
            className={cn(
                "group cursor-pointer hover:bg-[#1A1A1A] select-none relative",
                isCurrentTrack ? "bg-[#1A1A1A]" : "",
                (isSelected || isFocused) && "border border-[#1e3a8a]"
            )}
            tabIndex={0}
            onClick={onClickTrackRow}
            onKeyDown={onKeyDownTrackRow}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            <td className="py-[2px] pl-3 pr-2 tabular-nums w-10 text-center">
                {isCurrentTrack && isPlaying ? (
                    <div className="flex items-end justify-center space-x-[2px] size-[0.65rem] mx-auto">
                        <div className="w-1 bg-neutral-600 animate-now-playing-1"></div>
                        <div className="w-1 bg-neutral-600 animate-now-playing-2 [animation-delay:0.2s]"></div>
                        <div className="w-1 bg-neutral-600 animate-now-playing-3 [animation-delay:0.4s]"></div>
                    </div>
                ) : (
                    <span className="text-gray-400">{index + 1}</span>
                )}
            </td>
            <td className="py-[2px] px-2">
                <div className="flex items-center">
                    <div className="font-medium truncate max-w-[180px] sm:max-w-[200px] text-[#d1d5db]">
                        {track.title}
                        <span className="sm:hidden text-gray-400 ml-1">• {track.artist}</span>
                    </div>
                </div>
            </td>
            <td className="py-[2px] px-2 hidden sm:table-cell text-[#d1d5db] max-w-40 truncate">
                {track.artist}
            </td>
            <td className="py-[2px] px-2 hidden md:table-cell text-[#d1d5db]">
                {track.album ?? '-'}
            </td>
            <td className="py-[2px] px-2 tabular-nums text-[#d1d5db]">
                {formatDuration(track.duration)}
            </td>
            <td className="py-[2px] px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            disabled={isProduction}
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-gray-400 hover:text-white focus:text-white"
                        >
                            <MoreHorizontal className="size-4"/>
                            <span className="sr-only">Track options</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            className="text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isCurrentTrack) {
                                    togglePlayPause();
                                } else {
                                    playTrack(track);
                                }
                            }}
                        >
                            {isCurrentTrack && isPlaying ? (
                                <>
                                    <Pause className="mr-2 size-3 stroke-[1.5]"/>
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 size-3 stroke-[1.5]"/>
                                    Play
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="text-xs">
                                <Plus className="mr-2 size-3"/>
                                Add to Playlist
                            </DropdownMenuSubTrigger>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>

    );
}

export function TrackTable({
                               playlist,
                           }: {
    playlist: Song[];
}) {
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

    let {registerPanelRef, setActivePanel, setPlaylist, activePanel} = usePlayback();
    let tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        registerPanelRef('tracklist', tableRef);
    }, [registerPanelRef]);

    useEffect(() => {
        setPlaylist(playlist);
    }, [playlist, setPlaylist]);

    return (
        <table
            ref={tableRef}
            className="w-full text-xs"
        >
            <thead className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-[#282828]">
            <tr className="text-left text-gray-400">
                <th className="py-2 pl-3 pr-2 font-medium w-10">#</th>
                <th className="py-2 px-2 font-medium">Title</th>
                <th className="py-2 px-2 font-medium hidden sm:table-cell">Artist</th>
                <th className="py-2 px-2 font-medium hidden md:table-cell">Album</th>
                <th className="py-2 px-2 font-medium">Duration</th>
                <th className="py-2 px-2 font-medium w-8"></th>
            </tr>
            </thead>
            <tbody className="mt-[1px]">
            {playlist?.map((track: Song, index: number) => (
                <TrackRow
                    key={track.id}
                    track={track}
                    index={index}
                    isSelected={selectedTrackId === track.id}
                    onSelect={() => setSelectedTrackId(track.id)}
                />
            ))}
            </tbody>
        </table>
    );
}
