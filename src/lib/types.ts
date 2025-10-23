export interface Track {
    id: number;
    title: string;
    number: number;
    video: string;
    lyrics: string;
}

export interface Album {
    id: number;
    title: string;
    artist: string;
    year: string;
    image: string;
    description: string;
    tracks: Track[]
}


export interface Artist {
    artist: string;
}