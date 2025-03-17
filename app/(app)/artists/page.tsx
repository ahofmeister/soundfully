import React from "react";
import { createClient } from "@/utils/supabase/server";
import { ArtistCard } from "@/app/(app)/artists/artist-card";

export type ArtistWithSongCount = { name: string; count: number };

const ArtistsOverviewPage = async () => {
  const supabase = createClient();

  const { data } = await supabase
    .from("song")
    .select("name:artist, count: count()")
    .order("artist", { ascending: true })
    .returns<ArtistWithSongCount[]>();

  return (
    <div className="p-1 flex flex-col gap-1">
      {data?.map((artist) => <ArtistCard key={artist.name} artist={artist} />)}
    </div>
  );
};

export default ArtistsOverviewPage;
