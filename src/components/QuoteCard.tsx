import { Quote } from "@/lib/types";
import { useSession } from "next-auth/react";

interface QuoteCardProps {
    quote: Quote;
    onClick: (quoteId: number, uri: string) => void;
}

export default function QuoteCard({ quote, onClick }: QuoteCardProps) {
    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;


    const displayDate = quote.date
        ? new Date(quote.date).toLocaleDateString()
        : "";

    const displayUser =
        quote.userName ||
        quote.userUsername ||
        `User ${quote.userId}`;

    const hasTrackInfo =
        quote.albumImage ||
        quote.trackTitle ||
        quote.albumTitle;

    return (
        <div
            className='card'
            onClick={(e) => {
                if (!isLoggedIn) {
                    console.log("User must be logged in to view quote.");
                    return;
                }
                e.currentTarget.style.transform = "scale(.97)";
                e.currentTarget.style.transition = "transform 0.06s";
                onClick(quote.id, "/quotes/show/");
            }}
            style={{
                width: '20rem',
                background: "none",
                gap: "10px",
                margin: "10px",
                border: "none",
                flex: '0 0 auto',
                cursor: isLoggedIn ? "pointer" : "not-allowed",
                opacity: isLoggedIn ? 1 : 0.7,
            }}
            onMouseEnter={(e) => {
                if (isLoggedIn) {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.transition = "transform 0.2s";
                }
            }}
            onMouseLeave={(e) => {
                if (isLoggedIn) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.transition = "transform 0.2s";
                }
            }}
        >
            <div
                className='card-body'
                style={{
                    color: "white",
                    background: "rgba(144, 144, 144, 0.68)",
                    borderRadius: "10px",
                    padding: "15px",
                    width: "100%",
                }}
            >

                {hasTrackInfo && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                        }}
                    >
                        {quote.albumImage && (
                            <img
                                src={quote.albumImage}
                                alt={quote.albumTitle ?? "Album"}
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "6px",
                                    objectFit: "cover",
                                }}
                            />
                        )}

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {quote.trackTitle && (
                                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                                    {quote.trackTitle}
                                </span>
                            )}
                            {quote.albumTitle && (
                                <span style={{ fontSize: "12px", color: "lightgray" }}>
                                    {quote.albumTitle}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <h6
                    className='card-title'
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                        fontSize: "28px",
                        lineHeight: "1.2",
                        padding: "10px",
                        paddingBottom: "20px",
                        whiteSpace: "pre-line",
                    }}
                >
                    “{quote.lyric}”
                </h6>
                <span
                    style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "10px",
                        fontSize: "14px",
                        color: "white",
                        opacity: 0.8,
                        paddingTop: "10px",
                    }}
                >
                    {displayUser} | {displayDate}
                </span>
            </div>
        </div>
    );
}
