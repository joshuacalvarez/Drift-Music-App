"use client";

import { get } from "@/lib/apiClient";
import { Album, Track } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";


export default function EditAlbumPage() {
    const router = useRouter();
    const params = useParams();
    const albumId = params?.id; // undefined under /new
    const defaultAlbum: Album = {
        id: 0,
        title: "",
        artist: "",
        description: "",
        year: -1,
        image: "",
        tracks: [] as Track[],
    };

    const [album, setAlbum] = useState(defaultAlbum);    // Load album only when editing    
    useEffect(() => {
        if (!albumId) return; // creation mode        
        (async () => {
            const res = await get<Album>(`/albums/${albumId}`);
            setAlbum(res);
        })();
    }, [albumId]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = albumId ? "PUT" : "POST";
        const url = albumId ? `/api/albums/${albumId}` : `/api/albums`;
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(album),
        });
        router.push("/");
    };
    const onChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setAlbum((prev) => ({ ...prev, [key]: e.target.value }));


    const cancelPath = albumId ? `/albums/show/${albumId}` : `/albums`;

    return (
        <main>
            <h1>{albumId ? "Edit Album" : "Create Album"}</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", marginTop: "10px", overflowY: "auto", maxHeight: "80vh" }}>
                <h4>Image URL</h4><img src={album.image} alt={album.title} style={{ maxWidth: "300px", maxHeight: "300px", marginBottom: "10px" }} />
                <textarea placeholder="Image URL" value={album.image} onChange={onChange("image")} />
                <h4>Title</h4> 
                <input placeholder="Title" value={album.title} onChange={onChange("title")} />
                <h4>Artist</h4> 
                <input placeholder="Artist" value={album.artist} onChange={onChange("artist")} />
                <h4>Year</h4> 
                <input placeholder="Year" value={album.year} onChange={onChange("year")} />
                <h4>Description</h4> 
                <textarea placeholder="Description" value={album.description}onChange={onChange("description")} />
                <div style={{ height: "20px" }}>
                <button type="submit" style={{ border: "none", width: "100px", height: "50px", color: "rgba(53, 53, 53, 1)", backgroundColor: "white", borderRadius: "50px" }}>{albumId ? "Update" : "Save"}</button>
                <button type="button" style={{ border: "none", width: "100px", height: "50px", color: "rgba(224, 224, 224, 1)", backgroundColor: "rgba(41, 41, 41, 1)", borderRadius: "50px", marginLeft: "20px" }} onClick={() => router.push(cancelPath)}>Cancel</button>
                </div>
            </form>
        </main>
    );
}