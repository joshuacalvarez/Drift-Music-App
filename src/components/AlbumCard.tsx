import { Album } from "@/lib/types";
import { useSession } from "next-auth/react";


interface AlbumCardProps {
    album: Album;

    onClick: (albumId: number, uri: string) => void;
}

export default function AlbumCard({ album, onClick }: AlbumCardProps) {

    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;


    console.log(album);
    console.log(album.id);
    console.log(session?.user?.email);

    return (
        <div className='card' style={{ width: '18rem' }}>
            <img src={album.image} alt="title" />
            <div className='card-body'>
                <h5 className='card-title'>{album.title}</h5>
                <p className='card-text'>{album.description}</p>
                {isLoggedIn && (<button
                    onClick={() => onClick(album.id, '/show/')}
                    className='btn btn-primary'>
                    Show
                </button>)}
                {isLoggedIn && (<button
                    onClick={() => onClick(album.id, '/edit/')}
                    className='btn btn-secondary'>
                    Edit
                </button>)}
            </div>
        </div>
    );
}