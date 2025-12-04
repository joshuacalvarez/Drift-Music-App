"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { get } from "@/lib/apiClient";
import NavBar from "@/components/NavBar";
import { Album } from "@/lib/types";
import AlbumCard from "@/components/AlbumCard";
import SearchAlbum from "@/components/SearchAlbum";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Page() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [albumList, setAlbumList] = useState<any[]>([]);
  const [currentlySelectedAlbumId, setCurrentlySelectedAlbumId] = useState(0);
  const [error, setError] = useState("");

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  let router = useRouter();

  const loadAlbums = async () => {
    try {
      const response = await get<Album[]>("/albums");
      setAlbumList(response);
    }
    catch (error) {
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
      <h1>{error}</h1>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <h1>Albums</h1>
        {isAdmin && (
          <Link href="/albums/new">
            <button style={{ background: "rgba(65, 65, 65, 1)", border: "none", borderRadius: "10px", color: "white", width: "120px", height: "40px", fontSize: "20px" }} onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.transition = "transform 0.2s";
            }} onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.transition = "transform 0.2s";
            }} onClick={e => {
              e.currentTarget.style.transform = "scale(.95)";
            }}>Create New</button>
          </Link>
        )}
      </div>
      {albumList.length > 0 && <SearchAlbum albumList={renderedList} onClick={updateSingleAlbum} updateSearchResults={updateSearchResults} />}
    </main>
  );
}