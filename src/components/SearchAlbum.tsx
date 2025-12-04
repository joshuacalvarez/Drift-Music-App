import React from "react";
import SearchForm from "./SearchForm";
import AlbumList from "./FullAlbumList";
import { Album } from "@/lib/types";

interface AlbumListProps {
    albumList: Album[];
    onClick: (albumId: number, uri: string) => void;
    updateSearchResults: (searchTerm: string) => void;
}

const SearchAlbum = ({ albumList, onClick, updateSearchResults}: AlbumListProps) => {
    // console.log('props with update sing album', props);
    return (
        <div className='container'>
            <SearchForm onSubmit={updateSearchResults} />

            <AlbumList albumList={albumList} onClick={(albumId: number, uri: string) => onClick(albumId, uri)} />
        </div>
    );
};

export default SearchAlbum;