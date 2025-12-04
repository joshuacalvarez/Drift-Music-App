// app/quotes/show/[id]/page.tsx
"use client";

import OneQuote from "@/components/OneQuote";
import { get } from "@/lib/apiClient";
import { Quote } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ShowQuotePage() {
  const router = useRouter();
  const params = useParams();

  const rawId = params?.id as string | undefined;

  const defaultQuote: Quote = {
    id: -1,
    lyric: "",
    date: new Date(),
    trackId: -1,
    userId: -1,
    // optional fields from your type:
    trackTitle: null,
    albumId: null,
    albumTitle: null,
    albumImage: null,
    userName: null,
    userUsername: null,
  };

  const [quote, setQuote] = useState<Quote>(defaultQuote);

  useEffect(() => {
    if (!rawId) return;

    (async () => {
      try {
        const res = await get<Quote>(`/quotes/${rawId}`);
        setQuote(res);
        console.log("Loaded quote", res);
      } catch (err) {
        console.error("Failed to load quote", err);
        router.push("/quotes");
      }
    })();
  }, [rawId]);

  return (
    <OneQuote
      quote={quote}
    />
  );
}
