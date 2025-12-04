"use client";

import { get } from "@/lib/apiClient";
import { Album, Track } from "@/lib/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";

export default function EditTrackPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    // id from the route: /tracks/[id] or /tracks/new
    const rawId = params?.id as string | undefined;

    // Treat "new" or undefined as "no trackId" (create mode)
    const trackId = rawId && rawId !== "new" ? rawId : undefined;
    const isEditing = !!trackId;

    // albumId from query string in create mode: /tracks/new?albumId=16
    const albumIdFromQuery = searchParams?.get("albumId");

    const defaultTrack: Track = {
        id: 0,
        albumId: 0,
        title: "",
        number: 0,
        video: "",
        lyrics: "",
    };

    const [track, setTrack] = useState<Track>(defaultTrack);
    const [album, setAlbum] = useState<Album | null>(null);

    // Load track when editing
    useEffect(() => {
        if (!trackId) return; // creation mode, nothing to load

        (async () => {
            const res = await get<Track>(`/tracks/${trackId}`);
            setTrack(res);
        })();
    }, [trackId]);

    useEffect(() => {
        if (isEditing) return;
        if (!albumIdFromQuery) return;

        const idNum = Number(albumIdFromQuery);
        if (!Number.isInteger(idNum)) return;

        (async () => {
            const albumRes = await get<Album>(`/albums/${idNum}`);
            setAlbum(albumRes);

            setTrack((prev) => ({ ...prev, albumId: idNum }));
        })();
    }, [isEditing, albumIdFromQuery]);

    useEffect(() => {
        if (!isEditing) return;
        if (!track.albumId) return;

        (async () => {
            const albumRes = await get<Album>(`/albums/${track.albumId}`);
            setAlbum(albumRes);
        })();
    }, [isEditing, track.albumId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing ? `/api/tracks/${trackId}` : `/api/tracks`;

        const payload: Track = {
            ...track,
            number: Number(track.number),
        };

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (album?.id) {
            router.push(`/albums/show/${album.id}`);
        } else {
            router.push("/");
        }
    };

    const onChange =
        (key: keyof Track) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value =
                key === "number" ? Number(e.target.value) || 0 : e.target.value;
            setTrack((prev) => ({ ...prev, [key]: value }));
        };

    return (
        <main>
            <NavBar />
            <h1>{isEditing ? "Edit Track" : "Create Track"}</h1>

            {album && (
                <section
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "10px",
                        marginBottom: "20px",
                    }}
                >
                    <h3>Album: {album.title}</h3>
                    <p>
                        {album.artist} ({album.year})
                    </p>
                    {album.image && (
                        <img
                            src={album.image}
                            alt={album.title}
                            style={{ maxWidth: "200px", borderRadius: "8px" }}
                        />
                    )}
                </section>
            )}

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "center",
                    marginTop: "10px",
                    overflowY: "auto",
                    maxHeight: "40vh",
                }}
            >
                <h4>Title</h4>
                <input
                    placeholder="Title"
                    value={track.title}
                    onChange={onChange("title")}
                />

                <h4>Number</h4>
                <input
                    placeholder="Number"
                    value={track.number}
                    onChange={onChange("number")}
                    type="number"
                />

                <h4>Video URL</h4>
                <textarea
                    placeholder="Video URL"
                    value={track.video}
                    onChange={onChange("video")}
                />

                <h4>Lyrics</h4>
                <textarea
                    placeholder="Lyrics"
                    value={track.lyrics}
                    onChange={onChange("lyrics")}
                />

                <div style={{ height: "20px", marginTop: "20px" }}>
                    <button
                        type="submit"
                        style={{
                            border: "none",
                            width: "100px",
                            height: "50px",
                            color: "rgba(53, 53, 53, 1)",
                            backgroundColor: "white",
                            borderRadius: "50px",
                        }}
                    >
                        {isEditing ? "Update" : "Save"}
                    </button>
                    <button
                        type="button"
                        style={{
                            border: "none",
                            width: "100px",
                            height: "50px",
                            color: "rgba(224, 224, 224, 1)",
                            backgroundColor: "rgba(41, 41, 41, 1)",
                            borderRadius: "50px",
                            marginLeft: "20px",
                        }}
                        onClick={() => {
                            if (album?.id) {
                                router.push(`/albums/show/${album.id}`);
                            } else {
                                router.push("/");
                            }
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
}
