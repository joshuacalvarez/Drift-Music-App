"use client";
import OneTrack from "@/components/OneTrack";
import { get } from "@/lib/apiClient";
import { Album, Track } from "@/lib/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
export default function ShowTrackPage() {
    const router = useRouter();
    // Next.js params hook replaces useParams from react-router
    const params = useParams();
    const trackId = params?.id;
    console.log("Track ID:", trackId);
    const defaultTrack: Track = {
        id: -1,
        albumId: -1,
        title: "",
        number: -1,
        video: "",
        lyrics: "",
    };

    const defaultAlbum: Album = {
        id: -1,
        title: "",
        artist: "",
        description: "",
        year: -1,
        image: "",
        tracks: [] as Track[],
    };

    const [track, setTrack] = useState(defaultTrack);

    useEffect(() => {
        if (!trackId) return;

        (async () => {
            const res = await get<Track>(`/tracks/${trackId}`);
            setTrack(res);
            console.log(res);
        })();
    }, [trackId]);


    const [album, setAlbum] = useState(defaultAlbum);
    useEffect(() => {
        if (track.albumId === -1) return;
        (async () => {
            const res = await get<Album[]>(`/albums/?albumId=${track.albumId}`);
            if (res.length > 0) setAlbum(res[0]);
            console.log(res);
        })();
    }, [track.albumId]);

    return (
        <OneTrack track={track} album={album} />
    );
}