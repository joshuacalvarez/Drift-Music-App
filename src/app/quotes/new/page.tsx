// app/quotes/new/page.tsx
import { getPool } from "@/lib/db";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type NewQuotePageProps = {
    searchParams: {
        trackId?: string;
        lines?: string;
    };
};

export default async function NewQuotePage({ searchParams }: NewQuotePageProps) {
    const trackId = Number(searchParams.trackId);
    const linesParam = searchParams.lines;

    if (!trackId || !linesParam) {
        redirect("/tracks");
    }

    let indices = linesParam
        .split(",")
        .map((v) => Number(v))
        .filter((n) => !Number.isNaN(n));

    if (indices.length === 0) {
        redirect(`/tracks/show/${trackId}`);
    }

    indices = Array.from(new Set(indices)).sort((a, b) => a - b);

    if (
        indices.length === 0 ||
        indices.length > 4 ||
        !indices.every((idx, i) => i === 0 || idx === indices[i - 1] + 1)
    ) {
        redirect(`/tracks/show/${trackId}`);
    }

    const pool = getPool();
    const res = await pool.query<{
        title: string;
        lyrics: string | null;
    }>(
        `
      SELECT title, lyrics
      FROM tracks
      WHERE id = $1
    `,
        [trackId]
    );

    if (res.rowCount === 0) {
        notFound();
    }

    const track = res.rows[0];
    const allLines =
        track.lyrics
            ?.split(/\r?\n/)
            .filter((line) => line.trim().length > 0) ?? [];

    if (indices.some((i) => i < 0 || i >= allLines.length)) {
        redirect(`/tracks/show/${trackId}`);
    }

    const selectedLines = indices.map((i) => allLines[i]);
    const quoteText = selectedLines.join("\n");

    return (
        <div>
            <div>
                <h2 style={{ marginBottom: "10px" }}>Create Quote</h2>
            </div>
            <div style={{ color: "white", padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
                <p style={{ marginBottom: "4px" }}>
                    From track <strong>{track.title}</strong>
                </p>
                <p style={{ marginBottom: "20px", fontSize: "14px", opacity: 0.8 }}>
                    You selected {indices.length} line{indices.length > 1 ? "s" : ""}
                </p>

                <div
                    style={{
                        whiteSpace: "pre-wrap",
                        padding: "20px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.08)",
                        fontSize: "28px",
                        lineHeight: 1.4,
                        marginBottom: "24px",
                    }}
                >
                    {quoteText}
                </div>

                <form method="POST" action="/api/quotes">
                    <input type="hidden" name="trackId" value={trackId} />
                    <input type="hidden" name="lines" value={indices.join(",")} />

                    <div style={{display: "flex", gap: "10px"}}>
                        <button type="submit" className="btn btn-primary">
                        Save Quote
                    </button>
                    <Link
                        href={`/tracks/show/${trackId}`}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </Link>
                    </div>
                    
                </form>
            </div>

        </div>
    );
}
