// AlbumList.tsx
import React from 'react';
import { Album } from '@/lib/types';
import AlbumCard from './AlbumCard';

interface AlbumListProps {
  albumList: Album[];
  onClick: (albumId: number, uri: string) => void;
}

const AlbumList = ({ albumList, onClick }: AlbumListProps) => {
  console.log('props albumList', albumList);

  const albums = albumList.map((album) => (
    <AlbumCard
      key={album.id}
      album={album}
      onClick={(albumId: number, uri: string) => onClick(albumId, uri)}
    />
  ));

  return (
    <div className="container">
      <div className="d-flex flex-nowrap overflow-auto gap-4 py-4">
        {albums}
      </div>
    </div>
  );
};

export default AlbumList;
