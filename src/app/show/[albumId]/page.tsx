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
        year: 0,
        image: "",
        tracks: [] as Track[],
    };
    // Type safe use of defaultAlbum to initialize state
    // Rather than the ad hoc album object used previously, this ensures correct typing and calms TypeScript
    const [album, setAlbum] = useState(defaultAlbum);
    // Load album only when editing
    useEffect(() => {
        if (!albumId) return; // creation mode
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