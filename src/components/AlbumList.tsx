import React from 'react';
import { Album } from '@/lib/types';
import AlbumCard from './AlbumCard';

interface AlbumListProps {
    albumList: Album[];
    onClick: (albumId: number, uri: string) => void;
}


const AlbumList = ({ albumList, onClick}: AlbumListProps) => {
    
    // const handleSelectionOne = (albumId, uri) => {
    //     console.log('Selected ID is ' + albumId);
    //     props.onClick(albumId, uri);
    // };

    console.log('props albumList', albumList);
    const albums = albumList.map((album) => {
        return (
            <AlbumCard key={album.id} album={album} onClick={(albumId: number, uri: string) => onClick(albumId, uri)}/>
        );
    });


    return (
    <div className="container">
        <div className="d-flex flex-wrap">
            {albums}
        </div>
    </div>
    );

};

export default AlbumList;