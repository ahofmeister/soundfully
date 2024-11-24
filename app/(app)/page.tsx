import React, {Suspense} from 'react';
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {createClient} from "@/utils/supabase/server";
import {TrackTable} from "@/app/track-table";

async function Tracks({
                          searchParams,
                      }: {
    searchParams: { q: string };
}) {
    const {data: songs} = await createClient().from("song").select("*")
    return <TrackTable playlist={songs ?? []}/>;
}


const Page = async (  props: {
    searchParams: Promise<{ q: string }>;
}) => {
    const searchParams = await props.searchParams;
    return (
        <div className={"flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] pb-[69px] pt-2"}>
            <ScrollArea className="flex-1">
                <div className="min-w-max">
                    <Suspense fallback={<div className="w-full"/>}>
                        <Tracks searchParams={searchParams}/>
                    </Suspense>
                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </div>
    );
};

export default Page;