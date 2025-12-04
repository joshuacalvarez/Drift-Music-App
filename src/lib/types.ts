export interface Track {
    id: number;
    albumId: number;
    title: string;
    number: number;
    video: string;
    lyrics: string;
}


export interface Album {
    id: number;
    title: string;
    artist: string;
    year: number;
    image: string;
    description: string;
    tracks: Track[]
}


export interface Artist {
    artist: string;
}

export interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    role: "admin" | "user";
}

export interface Quote {
    id: number;
    lyric: string;
    date: Date;
    trackId: number;
    userId: number;

    trackTitle?: string | null;
    albumId?: number | null;
    albumTitle?: string | null;
    albumImage?: string | null;
    userName?: string | null;
    userUsername?: string | null;
}