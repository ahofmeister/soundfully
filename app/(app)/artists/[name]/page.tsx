import React from "react";
import { createClient } from "@/utils/supabase/server";
import { TrackTable } from "@/app/(app)/track-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const finalParams = await params;
  const supabase = createClient();

  const { data } = await supabase
    .from("song")
    .select("*")
    .eq("artist", decodeURIComponent(finalParams.name));

  return (
    <ScrollArea className="flex-1 mt-3">
      <div className="min-w-max">
        <TrackTable playlist={data ?? []} />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
