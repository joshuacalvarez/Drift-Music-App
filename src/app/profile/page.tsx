"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Quote } from "@/lib/types";
import QuoteList from "@/components/QuotesList";

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;

    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loadingQuotes, setLoadingQuotes] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        if (!user?.email) return;

        const loadUserQuotes = async () => {
            try {
                setLoadingQuotes(true);
                setError(null);

                const res = await fetch(
                    `/api/quotes/user/${encodeURIComponent(user.email!)}`
                );

                if (!res.ok) throw new Error("Failed to fetch quotes");

                const data: Quote[] = await res.json();
                data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setQuotes(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load your quotes.");
            } finally {
                setLoadingQuotes(false);
            }
        };

        loadUserQuotes();
    }, [user?.email]);

    const handleQuoteClick = (quoteId: number, uri: string) => {
        router.push(`${uri}${quoteId}`);
    };

    return (
        <div
            style={{
                minHeight: "70vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                gap: "30px",
            }}
        >
            <div
                style={{
                    width: "500px",
                    background: "rgba(27, 27, 27, 1)",
                    borderRadius: "12px",
                    padding: "40px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                    color: "white",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={user?.image ?? "/default-user.png"}
                        alt="Profile"
                        style={{
                            width: "260px",
                            height: "260px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "5px solid #414141ff",
                        }}
                    />
                </div>

                <UserField label="Display Name" value={user?.name ?? ""} />
                <UserField label="Email" value={user?.email ?? ""} />
            </div>

            <div>
                <h2 style={{ fontWeight: "bold" }}>Your Quotes</h2>
                <div
                    style={{
                        width: "450px",
                        maxHeight: "600px",
                        overflowY: "auto",
                        background: "rgba(80, 80, 80, 1)",
                        borderRadius: "12px",
                        padding: "20px",
                        color: "white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {loadingQuotes && <p>Loading your quotes…</p>}
                    {error && <p style={{ color: "tomato" }}>{error}</p>}

                    {!loadingQuotes && !error && quotes.length === 0 && (
                        <p style={{ opacity: 0.8 }}>
                            You haven&apos;t added any quotes yet.
                        </p>
                    )}

                    {!loadingQuotes && !error && quotes.length > 0 && (
                        <QuoteList
                            quoteList={quotes}
                            onClick={handleQuoteClick}
                            direction="vertical"
                        />
                    )}
                </div>
            </div>

        </div>
    );
}

function UserField({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ marginBottom: "18px" }}>
            <div style={{ fontWeight: 600, marginBottom: "6px", fontSize: "15px" }}>
                {label}:
            </div>
            <div
                style={{
                    background: "#111",
                    color: "white",
                    padding: "12px 14px",
                    borderRadius: "6px",
                    fontSize: "15px",
                }}
            >
                {value}
            </div>
        </div>
    );
}
