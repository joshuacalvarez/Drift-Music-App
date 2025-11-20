"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { get } from "@/lib/apiClient";
import NavBar from "@/components/NavBar";
import { Album } from "@/lib/types";
import AlbumCard from "@/components/AlbumCard";
import SearchAlbum from "@/components/SearchAlbum";
import AboutPage from "@/components/AboutPage";

export default function Page() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [albumList, setAlbumList] = useState<any[]>([]);
  const [currentlySelectedAlbumId, setCurrentlySelectedAlbumId] = useState(0);
  const [error, setError] = useState("");

  let router = useRouter();

  const loadAlbums = async () => {
    try {
      const response = await get<Album[]>("/albums");
      setAlbumList(response);
    }
    catch (error){
      setError(`Failed to load albums: ${error}`)
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const updateSearchResults = async (phrase: string) => {
    console.log("phrase is " + phrase);
    setSearchPhrase(phrase);
  };

  const updateSingleAlbum = (albumId: number, uri: string) => {
    console.log("Update Single Album =", albumId);
    setCurrentlySelectedAlbumId(albumId);
    const path = `${uri}${albumId}`;
    console.log("path", path);
    router.push(path);
  };

  const renderedList = albumList.filter((album) => {
    if (
      (album.description ?? "").toLowerCase().includes(searchPhrase.toLocaleLowerCase()) || searchPhrase === ""
    ) {
      return true;
    }
    return false;
  });

  const onEditAlbum = () => {
    loadAlbums();
    router.push("/");
  };

  return (
    <main>
      < NavBar />
      <h1>Joshua Album list (Debug View)</h1>
      <p>This JSON data is rendered directly from the API response</p>
      <h1>{error}</h1>
      {albumList.length > 0 && <SearchAlbum albumList={renderedList} onClick={updateSingleAlbum} updateSearchResults={updateSearchResults}/>};
      <AboutPage/>
    </main>
  );
}