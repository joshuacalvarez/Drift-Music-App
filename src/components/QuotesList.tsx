// QuoteList.tsx
import React from "react";
import { Quote } from "@/lib/types";
import QuoteCard from "./QuoteCard";

interface QuoteListProps {
  quoteList: Quote[];
  onClick: (quoteId: number, uri: string) => void;
  direction?: "horizontal" | "vertical";
  variant?: "wrap" | "nowrap";
}

const QuoteList = ({ quoteList, onClick, direction = "horizontal", variant = "nowrap" }: QuoteListProps) => {
  const isHorizontal = direction === "horizontal";
  const isWrapVariant = variant === "wrap";

  return (
    <div className="container">
      <div
        className="d-flex py-4"
        style={{
          gap: "16px",
          flexDirection: isHorizontal ? "row" : "column",
          flexWrap: isWrapVariant ? "wrap" : "nowrap",
          overflowX: isHorizontal ? "auto" : "hidden",
          alignItems: isHorizontal ? "flex-start" : "center"
        }}
      >
        {quoteList.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default QuoteList;
