"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { get } from "@/lib/apiClient";
import NavBar from "@/components/NavBar";
import { Quote } from "@/lib/types";
import QuoteList from "@/components/QuotesList";

export default function Page() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [quoteList, setQuoteList] = useState<Quote[]>([]);
  const [currentlySelectedQuoteId, setCurrentlySelectedQuoteId] = useState(0);
  const [error, setError] = useState("");

  const router = useRouter();

  const loadQuotes = async () => {
    try {
      const response = await get<Quote[]>("/quotes");
      setQuoteList(response);
      setError("");
    } catch (error) {
      setError(`Failed to load quotes: ${error}`);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const updateSearchResults = (phrase: string) => {
    console.log("phrase is " + phrase);
    setSearchPhrase(phrase);
  };

  const updateSingleQuote = (quoteId: number, uri: string) => {
    console.log("Update Single Quote =", quoteId);
    setCurrentlySelectedQuoteId(quoteId);
    const path = `${uri}${quoteId}`;
    console.log("path", path);
    router.push(path);
  };


  const onEditQuote = () => {
    loadQuotes();
    router.push("/");
  };

  return (
    <main>
      <NavBar />
      {error && <h1 style={{ color: "red" }}>{error}</h1>}

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <h1>Quotes</h1>
      </div>

      {quoteList.length > 0 && (
        <QuoteList quoteList={quoteList} onClick={updateSingleQuote} variant="wrap"/>
      )}
    </main>
  );
}
