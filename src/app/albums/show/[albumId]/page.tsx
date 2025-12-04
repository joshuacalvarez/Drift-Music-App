// app/edit/[albumId]/page.tsx
"use client";
import OneAlbum from "@/components/OneAlbum";
import { get } from "@/lib/apiClient";
import { Album, Track } from "@/lib/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
export default function ShowAlbumPage() {
    const router = useRouter();
    // Next.js params hook replaces useParams from react-router
    const params = useParams();
    const albumId = params?.albumId; // undefined under /new
    const defaultAlbum: Album = {
        id: -1,
        title: "",
        artist: "",
        description: "",
        year: -1,
        image: "",
        tracks: [] as Track[],
    };

    const [album, setAlbum] = useState(defaultAlbum);
    useEffect(() => {
        if (!albumId) return;
        (async () => {
            const res = await get<Album[]>(`/albums/?albumId=${albumId}`);
            if (res.length > 0) setAlbum(res[0]);
            console.log(res);
        })();
    }, [albumId]);
    
    return (
        <OneAlbum id={album.id} title={album.title} artist={album.artist} year={album.year} image={album.image} description={album.description} tracks={album.tracks} />
        
    );
}