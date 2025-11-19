import { Album } from "@/lib/types";

interface AlbumCardProps{
    album: Album;

    onClick: (album: Album, uri: string) => void;
}

export default function AlbumCard({ album,onClick }: AlbumCardProps) {}