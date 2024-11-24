import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {PlaybackProvider} from "@/app/playback-context";
import {Playlists} from "@/components/playlist/playlists";
import {createClient} from "@/utils/supabase/server";
import {NowPlaying} from "@/components/playlist/now-playing";
import {Account} from "@/app/account";
import {ReactNode} from "react";

import '../globals.css'


export default async function RootLayout({
                                             children,
                                         }: {
    children: ReactNode;
}) {

    const {data: playlist} = await createClient().from("playlist").select("*")
    const supabase = createClient()

    const {data: {user}} = await supabase.auth.getUser()

    return (
        <>
            {user &&
                <div className={"flex items-end justify-end"}>
                    <Account user={user}/>
                </div>
            }
            <div className={"flex flex-col md:flex-row flex-1"}>
                <PlaybackProvider>
                    <Playlists playlists={playlist ?? []}/>
                    {children}
                    <NowPlaying/>
                </PlaybackProvider>
            </div>
        </>
    );
}
