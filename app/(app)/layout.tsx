import { PlaybackProvider } from "@/app/playback-context";
import { Playlists } from "@/components/playlist/playlists";
import { createClient } from "@/utils/supabase/server";
import { Account } from "@/app/account";
import { ReactNode } from "react";

import "../globals.css";
import { PlaybackControls } from "@/components/playlist/playback-controls";
import { PlaylistProvider } from "@/app/use-playlist";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: playlists } = await supabase.from("playlist").select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {user && (
        <div className={"flex items-end justify-end"}>
          <Account user={user} />
        </div>
      )}
      <div className={"flex flex-col md:flex-row flex-1"}>
        <PlaybackProvider>
          <PlaylistProvider initialPlaylists={playlists ?? []}>
            <Playlists />
            {children}
          </PlaylistProvider>
          <PlaybackControls />
        </PlaybackProvider>
      </div>
    </>
  );
}
