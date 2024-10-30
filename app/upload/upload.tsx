"use client"
import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {createClient} from "@/utils/supabase/client";
import {parseBlob} from "music-metadata";
import {v4 as uuid} from 'uuid';
import {NewSong} from "@/utils/supabase/types";


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
                const metadata = await parseBlob(file)
                console.log(metadata)

                if (file) {
                    const id = uuid()
                    const songUpload = await supabase.storage
                        .from("songs")
                        .upload(`track-${metadata.common?.title}-${id}`, file, {cacheControl: "31536000"});

                    if (songUpload) {
                        let newSong: NewSong = {
                            title: metadata.common.title ?? '',
                            duration: Math.round(Number(metadata.format.duration)) ?? 0,
                            album: values.album,
                            path: songUpload.data?.path ?? '',
                            artist: metadata.common.artist ?? ''
                        };
                        const {data, error} = await supabase.from("song").insert(newSong);
                        console.log(error)
                        console.log(data)
                    }
                }
            }


            // let buffer = await fs.readFile(filePath);

            // console.log(metadata)


            // if (songFiles.error) {
            //     setIsLoading(false);
            // }


            //
            //     if (addSongRecord.error) {
            //         setIsLoading(false);
            //     }
            //
            //     // router.refresh();
            //     // setIsLoading(false);
            //     // toast.success("Song uploaded successfully");
            //     // uploadModal.onClose();
        } catch (error) {
            //     toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                    <Input multiple
                           id="song"
                           type="file"
                           disabled={isLoading}
                           accept=".mp3"
                           {...form.register("songs", {required: true})}
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Upload
                </Button>
            </form>
        </div>
    );
};

export default Upload;