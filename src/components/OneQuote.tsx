import { Quote } from "@/lib/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OneQuoteProps {
    quote: Quote;
}

export default function OneQuote({ quote }: OneQuoteProps) {
    const hasCover = !!quote.albumImage;
    const router = useRouter();


    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";
    const isOwner = session?.user?.id === quote.userId;


    const showDelete = isAdmin || isOwner;

    const displayUser =
        quote.userName || quote.userUsername || `User ${quote.userId}`;

    const displayDate = quote.date
        ? new Date(quote.date).toLocaleDateString()
        : "";

    const hasTrackInfo =
        quote.albumImage ||
        quote.trackTitle ||
        quote.albumTitle;


    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/quotes/${quote.id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error("Failed to delete quote:", error);
        }
        router.push("/quotes");
    };

    return (
        <div
            style={{
                padding: "40px",
                display: "flex",
                justifyContent: "center",
                margin: "auto",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: "575px",
                    height: "575px",
                    borderRadius: "6px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {hasCover && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${quote.albumImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(4px)",
                        }}
                    />
                )}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.95) 100%)",
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        width: "100%",
                        height: "100%",
                        padding: "32px",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    {!hasCover && (
                        <span
                            style={{
                                position: "absolute",
                                top: "10px",
                                left: "14px",
                                fontSize: "12px",
                                color: "#222",
                            }}
                        >
                            Cover Art
                        </span>
                    )}

                    <div
                        style={{
                            fontSize: "32px",
                            fontStyle: "italic",
                            margin: "auto",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
                            marginTop: "40%",
                            whiteSpace: "pre-line",
                        }}
                    >
                        “{quote.lyric}” <br />
                        <div
                            style={{
                                fontSize: "24px",
                                fontWeight: 600,
                                opacity: 0.85,
                                fontStyle: "normal",
                                marginTop: "20px",
                            }}
                        >
                            {displayUser}<br />
                            {displayDate && ` ${displayDate}`}
                        </div>
                    </div>

                    <div style={{ fontSize: "28px", opacity: 0.8, fontStyle: "normal" }}>
                        {quote.trackTitle && `${quote.trackTitle}`} <br />
                        <div style={{ fontSize: "20px" }}>
                            {quote.albumTitle && `${quote.albumTitle}`}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ gap: "20px", display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Link href="/quotes">
                    <button style={{ background: "rgba(65, 65, 65, 1)", border: "none", borderRadius: "10px", color: "white", width: "150px", height: "40px", fontSize: "18px", margin: "auto" }} onMouseEnter={e => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.transition = "transform 0.2s";
                    }} onMouseLeave={e => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.transition = "transform 0.2s";
                    }} onClick={e => {
                        e.currentTarget.style.transform = "scale(.95)";
                    }}>Back To Quotes</button>
                </Link>
                {showDelete && (
                    <Link href="/quotes">
                        <button style={{ background: "rgba(255, 84, 84, 1)", border: "none", borderRadius: "10px", color: "white", width: "150px", height: "40px", fontSize: "18px", margin: "auto", }} onMouseEnter={e => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.transition = "transform 0.2s";
                        }} onMouseLeave={e => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.transition = "transform 0.2s";
                        }} onClick={e => {
                            e.currentTarget.style.transform = "scale(.95)";
                            const confirmDelete = window.confirm("Are you sure you want to delete this quote?");
                            if (confirmDelete) {
                                handleDelete();
                            }
                        }}>Delete</button>
                    </Link>
                )}
            </div>
        </div>
    );
}
