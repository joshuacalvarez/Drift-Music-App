"use client";

import { Track, Album } from "@/lib/types";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type OneTrackProps = {
    track: Track;
    album: Album;
};

const OneTrack: React.FC<OneTrackProps> = ({ track, album }) => {
    const router = useRouter();

    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";

    const lyricLines =
        track.lyrics
            ?.split(/\r?\n/)
            .filter((line) => line.trim().length > 0) ?? [];

    const [selected, setSelected] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const toggleLine = (index: number) => {
        if (selected.length === 0) {
            setSelected([index]);
            return;
        }

        if (selected.includes(index)) {
            setSelected([]);
            return;
        }

        const sorted = [...selected].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];

        const isBefore = index === min - 1;
        const isAfter = index === max + 1;

        if (isBefore || isAfter) {
            if (sorted.length >= 4) {
                return; // don't exceed 4 lines
            }

            const next = isBefore ? [index, ...sorted] : [...sorted, index];
            setSelected(next);
            return;
        }

        setSelected([index]);
    };

    // 🔹 Call /api/quotes (formData) then go home
    const handleCreateQuote = async () => {
        if (selected.length === 0 || isSaving) return;

        try {
            setIsSaving(true);

            const formData = new FormData();
            formData.append("trackId", String(track.id));
            formData.append("lines", selected.join(","));

            const res = await fetch("/api/quotes", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                console.error("Failed to create quote", await res.text());
                setIsSaving(false);
                return;
            }

            router.push("/");
        } catch (error) {
            console.error("Error creating quote", error);
            setIsSaving(false);
        }
    };

    return (
        <div className="container" style={{ display: "flex" }}>
            <div
                className="left"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50%",
                }}
            >
                <div
                    className="card"
                    style={{
                        background: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: "20px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {album.image && (
                        <img
                            src={album.image}
                            className="card-img-top"
                            alt={album.title}
                            style={{ maxWidth: "45%" }}
                        />
                    )}
                </div>

                <div
                    className="card-body"
                    style={{
                        color: "white",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center",
                        gap: "6px",
                        width: "80%",
                    }}
                >
                    <h4 className="card-title">{album.title}</h4>
                    <h5>{album.artist}</h5>

                    {track.video && (
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                maxWidth: "900px",
                                margin: "0 auto",
                                paddingTop: "56.25%",
                            }}
                        >
                            <iframe
                                src={track.video.replace("watch?v=", "embed/")}
                                title={track.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                }}
                            />
                        </div>
                    )}

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "15px",
                        }}
                    >
                        <Link
                            href={`/albums/show/${album.id}`}
                            className="btn btn-secondary"
                        >
                            Back to Album
                        </Link>
                        {isAdmin && (
                            <Link
                                href={`/tracks/edit/${track.id}`}
                                className="btn btn-primary"
                            >
                                Edit Track
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                href="#" className='btn btn-danger' style={{ marginTop: "15px" }} onClick={(e) => {
                                    e.preventDefault();
                                    const confirmed = window.confirm("Are you sure you want to delete this track? This action cannot be undone.");
                                    if (confirmed) {
                                        fetch(`/api/tracks/${track.id}`, {
                                            method: "DELETE",
                                        })
                                    }
                                }}>
                                Delete
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="right" style={{ width: "50%" }}>
                <h3
                    style={{
                        marginTop: "10px",
                        fontWeight: "bold",
                        textAlign: "left",
                    }}
                >
                    Track #{track.number}: {track.title}
                </h3>

                {lyricLines.length > 0 && (
                    <>
                        <div
                            style={{
                                lineHeight: "1.5",
                                marginTop: "40px",
                                textAlign: "center",
                                maxHeight: "73vh",
                                overflowY: "auto",
                                background: "rgba(102, 102, 102, 0.3)",
                                padding: "35px",
                                borderRadius: "8px",
                                fontSize: "42px",
                            }}
                        >
                            {lyricLines.map((line, index) => {
                                const isSelected = selected.includes(index);

                                return (
                                    <div
                                        key={index}
                                        onClick={() => toggleLine(index)}
                                        style={{
                                            display: "block",
                                            marginBottom: "10px",
                                            cursor: "pointer",
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            transition:
                                                "transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
                                            transform: isSelected ? "scale(1.05)" : "scale(1)",
                                            background: isSelected
                                                ? "rgba(255,255,255,0.3)"
                                                : "transparent",
                                            boxShadow: isSelected
                                                ? "0 6px 18px rgba(0,0,0,0.4)"
                                                : "none",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                const el = e.currentTarget as HTMLDivElement;
                                                el.style.transform = "scale(1.03)";
                                                el.style.background =
                                                    "rgba(255,255,255,0.15)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                const el = e.currentTarget as HTMLDivElement;
                                                el.style.transform = "scale(1)";
                                                el.style.background = "transparent";
                                            }
                                        }}
                                    >
                                        {line}
                                    </div>
                                );
                            })}
                        </div>

                        <div
                            style={{
                                marginTop: "20px",
                                textAlign: "center",
                            }}
                        >
                            {selected.length > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleCreateQuote}
                                    disabled={isSaving}
                                >
                                    {isSaving
                                        ? "Creating..."
                                        : `Create Quote (${selected.length} line${selected.length > 1 ? "s" : ""
                                        })`}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OneTrack;
