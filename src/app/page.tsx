"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/lib/apiClient";
import NavBar from "@/components/NavBar";
import { Album, Quote } from "@/lib/types";
import AlbumCard from "@/components/AlbumCard";
import SearchAlbum from "@/components/SearchAlbum";
import AlbumList from "@/components/AlbumList";
import Link from "next/link";
import QuoteList from "@/components/QuotesList";


export default function Page() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [quoteList, setQuoteList] = useState<Quote[]>([]);
  const [currentlySelectedAlbumId, setCurrentlySelectedAlbumId] = useState(0);
  const [error, setError] = useState("");

  const router = useRouter();

  const loadAlbums = async () => {
    try {
      const response = await get<Album[]>("/albums");
      setAlbumList(response);
    } catch (error) {
      setError(`Failed to load albums: ${error}`);
    }
  };


  const loadQuotes = async () => {
    try {
      const response = await get<Quote[]>("/quotes");
      setQuoteList(response);
    } catch (error) {
      setError(`Failed to load quotes: ${error}`);
    }
  };

  useEffect(() => {
    loadAlbums();
    loadQuotes();
  }, []);

  const updateSingleAlbum = (albumId: number, uri: string) => {
    console.log("Update Single Album =", albumId);
    setCurrentlySelectedAlbumId(albumId);
    const path = `${uri}${albumId}`;
    console.log("path", path);
    router.push(path);
  };

  const updateSingleQuote = (quoteId: number, uri: string) => {
    router.push(`${uri}${quoteId}`);
  };

  const renderedList = albumList.filter((album) => {
    const description = (album.description ?? "").toLowerCase();
    const phrase = searchPhrase.toLowerCase();

    if (phrase === "") return true;
    return description.includes(phrase);
  });

  const sortedRenderedList = [...renderedList].sort((a, b) => b.year - a.year);
  const topEight = sortedRenderedList.slice(0, 8);

  const sortedQuoteList = [...quoteList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const topQuotes = sortedQuoteList.slice(0, 8);

  const onEditAlbum = () => {
    loadAlbums();
    router.push("/");
  };

  return (
    <main>
      <h1>{error}</h1>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <h1>Albums</h1>
        <Link href="/albums">
          <button style={{ background: "rgba(65, 65, 65, 1)", border: "none", borderRadius: "10px", color: "white", width: "120px", height: "40px", fontSize: "20px" }} onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.transition = "transform 0.2s";
          }} onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.transition = "transform 0.2s";
          }} onClick={e => {
            e.currentTarget.style.transform = "scale(.95)";
          }}>See All</button>
        </Link>
      </div>
      {albumList.length > 0 && (
        <AlbumList
          albumList={topEight}
          onClick={updateSingleAlbum}
        />

      )}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <h1>Quotes</h1>
        <Link href="/quotes">
          <button
            style={{
              background: "rgba(65, 65, 65, 1)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              width: "120px",
              height: "40px",
              fontSize: "20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.transition = "transform 0.2s";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.transition = "transform 0.2s";
            }}
            onClick={(e) => {
              e.currentTarget.style.transform = "scale(.95)";
            }}
          >
            See All
          </button>
        </Link>
      </div>

      {quoteList.length > 0 && (
        <QuoteList quoteList={topQuotes} onClick={updateSingleQuote} />
      )}

    </main>
  );
}
