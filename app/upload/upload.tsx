"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { createClient } from "@/utils/supabase/client";
import { parseBlob } from "music-metadata";
import { NewSong } from "@/utils/supabase/types";

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const form = useForm<FieldValues>({
    defaultValues: {
      // author: "",
      // album: "",
      // genre: "",
      // duration: 0,
      // title: "",
      songs: null,
      // image: null,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const songFiles: FileList = values?.songs;

      if (!songFiles) {
        //     toast.error("missing fields");
        return;
      }

      for await (const file of Array.from(songFiles)) {
        const metadata = await parseBlob(file);

        if (file) {
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("songs")
              .upload(
                `track-${convertFileNameToBase64(metadata.common?.title!)}`,
                file,
                { cacheControl: "31536000" },
              );

          if (uploadData) {
            let newSong: NewSong = {
              title: metadata.common.title ?? "",
              duration: Math.round(Number(metadata.format.duration)) ?? 0,
              album: values.album,
              path: uploadData.path ?? "",
              artist: metadata.common.artist ?? "",
            };
            const { data, error } = await supabase.from("song").insert(newSong);
            console.log(error);
          }

          if (uploadError) {
            console.log(uploadError);
          }
        }
      }
    } catch (error) {
      //     toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="" onSubmit={form.handleSubmit(onSubmit)}>
      <div className={"flex flex-col justify-center items-center"}>
        <Input
          multiple
          id="song"
          className={"cursor-pointer"}
          type="file"
          disabled={isLoading}
          accept=".mp3"
          {...form.register("songs", { required: true })}
        />
        <Button className={"w-full mt-4"} disabled={isLoading} type="submit">
          Upload
        </Button>
      </div>
    </form>
  );
};

export default Upload;

function base64ToBytes(base64: string): Uint8Array {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0) as number);
}

function bytesToBase64(bytes: Uint8Array): string {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}

const convertFileNameToBase64 = (name: string): string => {
  return bytesToBase64(new TextEncoder().encode(name));
};

const convertBase64ToFileName = (encoded: string): string => {
  return new TextDecoder().decode(base64ToBytes(encoded));
};
