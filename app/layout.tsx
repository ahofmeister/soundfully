import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {PlaybackProvider} from "@/app/playback-context";
import {Playlists} from "@/components/playlist/playlists";
import {createClient} from "@/utils/supabase/server";
import {PlaylistWithSongs} from "@/utils/supabase/types";
import {NowPlaying} from "@/components/playlist/now-playing";

export const metadata: Metadata = {
    title: 'Soundfully',
    description: 'Your music.',
};


const inter = Inter({subsets: ['latin']});

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {

    const {data: playlist} = await createClient().from("playlist").select("*")

    return (
        <html lang="en" className={inter.className}>
        <body className="dark flex flex-col md:flex-row h-[100dvh] text-gray-200 bg-[#0A0A0A]">

        <PlaybackProvider>
            <Playlists playlists={playlist ?? []}/>
            {children}
            <NowPlaying/>
        </PlaybackProvider>
        </body>
        </html>
    );
}
