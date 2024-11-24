import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {PlaybackProvider} from "@/app/playback-context";
import {Playlists} from "@/components/playlist/playlists";
import {createClient} from "@/utils/supabase/server";
import {NowPlaying} from "@/components/playlist/now-playing";
import {Account} from "@/app/account";

export const metadata: Metadata = {
    title: 'soundfully',
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
        <body className="dark   h-[100dvh] text-gray-200 bg-[#0A0A0A]">

        <div className={"flex items-end justify-end"}>
            <Account/>
        </div>
        <div className={"flex flex-col md:flex-row"}>
            <PlaybackProvider>
                <Playlists playlists={playlist ?? []}/>
                {children}
                <NowPlaying/>
            </PlaybackProvider>
        </div>
        </body>
        </html>
    );
}
