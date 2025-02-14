"use client";
import React from "react";
import { ArtistWithSongCount } from "@/app/(app)/artists/page";
import { useRouter } from "next/navigation";
import { CardDescription } from "@/components/ui/card";

export function ArtistCard(props: { artist: ArtistWithSongCount }) {
  const router = useRouter();
  return (
    <div
      className="p-2 cursor-pointer"
      onClick={() => router.push(`/artists/${props.artist.name}`)}
    >
      <div>{props.artist.name}</div>
      <CardDescription>{props.artist.songCount} songs</CardDescription>
    </div>
  );
}
