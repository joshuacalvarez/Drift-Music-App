import { Album } from "@/lib/types";
import { useSession } from "next-auth/react";

interface AlbumCardProps {
    album: Album;
    onClick: (albumId: number, uri: string) => void;
}

export default function AlbumCard({ album, onClick }: AlbumCardProps) {

    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;

    return (
        <div
            className='card'
            onClick={(e) => {
                if (isLoggedIn) {
                    e.currentTarget.style.transform = "scale(.97)";
                    e.currentTarget.style.transition = "transform 0.06s";
                    onClick(album.id, "/albums/show/");
                } else {
                    console.log("User must be logged in to view album.");

                }
            }}
            style={{
                width: '12rem',
                background: "none",
                gap: "10px",
                margin: "10px",
                border: "none",
                flex: '0 0 auto',
                cursor: isLoggedIn ? "pointer" : "not-allowed",
                opacity: isLoggedIn ? 1 : 0.7,
            }}
            onMouseEnter={(e) => {
                if (isLoggedIn) {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.transition = "transform 0.2s";
                }
            }}
            onMouseLeave={(e) => {
                if (isLoggedIn) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.transition = "transform 0.2s";
                }
            }}
        >
            <img
                src={album.image}
                alt="title"
                style={{
                    borderRadius: "15px",
                    maxWidth: "100%",
                    maxHeight: "100%"
                }}
            />
            <div className='card-body' style={{ color: "white" }}>
                <h6
                    className='card-title'
                    style={{
                        whiteSpace: "wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center"
                    }}
                >
                    {album.title}
                </h6>
                <p
                    className='card-text'
                    style={{ textAlign: "center", color: "darkgray" }}
                >
                    {album.artist}
                </p>
            </div>
        </div>
    );
}
