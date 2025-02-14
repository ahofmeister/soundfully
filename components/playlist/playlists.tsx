"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePlayback } from "@/app/playback-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Playlist } from "@/utils/supabase/types";
import { usePlaylist } from "@/app/use-playlist";

function PlaylistRow({ playlist }: { playlist: Playlist }) {
  let pathname = usePathname();

  return (
    <li className="group relative">
      <Link
        prefetch={true}
        href={`/playlist/${playlist.id}`}
        className={`block py-1 px-4 cursor-pointer hover:bg-[#1A1A1A] text-[#d1d5db] focus:outline-none focus:ring-[0.5px] focus:ring-gray-400 ${
          pathname === `/p/${playlist.id}` ? "bg-[#1A1A1A]" : ""
        }`}
        tabIndex={0}
      >
        {playlist.name}
      </Link>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white focus:text-white"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Playlist options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              // onClick={() => handleDeletePlaylist(playlist.id)}
              className="text-xs"
            >
              <Trash className="mr-2 size-3" />
              Delete Playlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}

export function Playlists() {
  let pathname = usePathname();
  let router = useRouter();
  let { handleKeyNavigation, setActivePanel } = usePlayback();
  const { playlists } = usePlaylist();
  // async function addPlaylistAction() {
  //     let newPlaylistId = uuidv4();
  //     let newPlaylist = {
  //         id: newPlaylistId,
  //         name: 'New Playlist',
  //         coverUrl: '',
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //     };
  //
  //     // updatePlaylist(newPlaylistId, newPlaylist);
  //     router.prefetch(`/playlist/${newPlaylistId}`);
  //     router.push(`/playlist/${newPlaylistId}`);
  //     createPlaylistAction(newPlaylistId, 'New Playlist');
  //     router.refresh();
  // }

  return (
    <div
      className="hidden md:block w-56 bg-[#121212] h-[100dvh] overflow-auto rounded-lg"
      onClick={() => setActivePanel("sidebar")}
    >
      <div className="m-4">
        {/*<SearchInput />*/}
        <div className="mb-6">
          <Link
            href="/"
            className={`block py-1 px-4 -mx-4 text-xs text-[#d1d5db] hover:bg-[#1A1A1A] transition-colors focus:outline-none focus:ring-[0.5px] focus:ring-gray-400 ${
              pathname === "/" ? "bg-[#1A1A1A]" : ""
            }`}
          >
            All Tracks
          </Link>
          <Link
            href="/artists"
            className={`block py-1 px-4 -mx-4 text-xs text-[#d1d5db] hover:bg-[#1A1A1A] transition-colors focus:outline-none focus:ring-[0.5px] focus:ring-gray-400 ${
              pathname === "/" ? "bg-[#1A1A1A]" : ""
            }`}
          >
            All Artists
          </Link>
        </div>
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/"
            className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Playlists
          </Link>
          <form
          // action={addPlaylistAction}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              type="submit"
            >
              <Plus className="w-3 h-3 text-gray-400" />
              <span className="sr-only">Add new playlist</span>
            </Button>
          </form>
        </div>
      </div>
      <ScrollArea className="h-[calc(100dvh-180px)]">
        <ul
          // ref={playlistsContainerRef}
          className="space-y-0.5 text-xs mt-[1px]"
          onKeyDown={(e) => handleKeyNavigation(e, "sidebar")}
        >
          {playlists.map((playlist) => (
            <PlaylistRow key={playlist.id} playlist={playlist} />
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
