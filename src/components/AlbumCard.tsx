import { Album } from "@/lib/types";

interface AlbumCardProps{
    album: Album;

    onClick: (albumId: number, uri: string) => void;
}

export default function AlbumCard({ album,onClick }: AlbumCardProps) {
    return (
        <div className='card' style={{ width: '18rem' }}>
            <img src={album.image} alt="title" />
            <div className='card-body'>
                <h5 className='card-title'>{album.title}</h5>
                <p className='card-text'>{album.description}</p>
                <button
                    onClick={() => onClick(album.id, '/show/')}
                    className='btn btn-primary'>
                        Show
                </button>
                <button
                    onClick={() => onClick(album.id, '/edit/')}
                    className='btn btn-secondary'>
                    Edit
                </button>
            </div>
        </div>
    );
}