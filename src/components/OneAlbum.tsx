import { Album } from '@/lib/types';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';


const OneAlbum = (album: Album) => {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";

    return (
        <div className='container'>
            <div className='card' style={{ background: "none", display: "flex", flexDirection: "column", gap: "10px", padding: "20px", justifyContent: "center", alignItems: "center" }}>
                {album.image && (
                    <img
                        src={album.image}
                        className='card-img-top'
                        alt={album.title}
                        style={{ maxWidth: "35%" }}
                    />
                )}
                <div className='card-body' style={{ color: "white", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", textAlign: "center", gap: "1px", width: "80%" }}>
                    <h4 className='card-title'>{album.title}</h4>
                    <h5>{album.artist}</h5>
                    <h6>({album.year})</h6>
                    <p className='card-text'>{album.description}</p>
                    <div className='list-group' style={{ width: "100%", marginTop: "10px" }}>
                        {album.tracks && album.tracks.length > 0 ? (
                            album.tracks.map((track) => (
                                <Link href={`/tracks/show/${track.id}`} key={track.id} style={{ textDecoration: "none" }}>
                                    <div
                                        key={track.id}
                                        className='list-group-item'
                                        style={{
                                            background: "rgba(67, 67, 67, 0.5)",
                                            border: "none",
                                            color: "white",
                                            padding: "4px 0",
                                            fontSize: "20px",
                                            width: "60%",
                                            margin: "0 auto"
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(114, 114, 114, 0.5)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(67, 67, 67, 0.5)")}
                                        onClick={(e) => (e.currentTarget.style.scale = ".95", e.currentTarget.style.transition = "transform 0.2s")}
                                    >
                                        {track.number}. {track.title}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div
                                className='list-group-item'
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "darkgray",
                                    fontStyle: "italic",
                                    padding: "4px 0",
                                }}
                            >
                                No tracks found for this album.
                            </div>
                        )}
                    </div>
                    <Link href="/albums">
                        <button style={{ background: "rgba(65, 65, 65, 1)", border: "none", borderRadius: "10px", color: "white", width: "140px", height: "60px", fontSize: "20px", marginTop: "15px" }} onMouseEnter={e => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.transition = "transform 0.2s";
                        }} onMouseLeave={e => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.transition = "transform 0.2s";
                        }} onClick={e => {
                            e.currentTarget.style.transform = "scale(.95)";
                        }}>Back To Albums</button>
                    </Link>
                    {isAdmin && (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <Link href={`/albums/edit/${album.id}`} className='btn btn-primary' style={{ marginTop: "15px" }}>
                                Edit
                            </Link>
                            <Link href={`/tracks/edit/new?albumId=${album.id}`} className='btn btn-success' style={{ marginTop: "15px" }}>
                                Add Track
                            </Link>
                            <Link href="#" className='btn btn-danger' style={{ marginTop: "15px" }} onClick={(e) => {
                                e.preventDefault();
                                const confirmed = window.confirm("Are you sure you want to delete this album? This action cannot be undone.");
                                if (confirmed) {
                                    fetch(`/api/albums/${album.id}`, {
                                        method: "DELETE",
                                    })
                                }
                            }}>
                                Delete
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OneAlbum;