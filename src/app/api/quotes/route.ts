// app/api/quotes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { Quote } from "@/lib/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requireUser } from "@/lib/auth-guards";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const pool = getPool();

        const res = await pool.query<Quote>(
            `
      SELECT
        q.id,
        q.lyric,
        q.when_quoted AS "date",
        q.track_id    AS "trackId",
        q.user_id     AS "userId",
        t.title       AS "trackTitle",
        a.id          AS "albumId",
        a.title       AS "albumTitle",
        a.image       AS "albumImage",
        u.name        AS "userName"
      FROM quotes q
      LEFT JOIN tracks t ON q.track_id = t.id
      LEFT JOIN albums a ON t.album_id = a.id
      LEFT JOIN users u ON q.user_id = u.id
      ORDER BY q.when_quoted DESC, q.id DESC
      `
        );

        return NextResponse.json(res.rows);
    } catch (error) {
        console.error("GET /api/quotes error:", error);
        return NextResponse.json(
            { error: "Failed to load quotes" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const sessionOrResponse = await requireUser();
        if (sessionOrResponse instanceof NextResponse) {
            return sessionOrResponse;
        }

        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        const formData = await request.formData();
        const trackIdRaw = formData.get("trackId");
        const linesRaw = formData.get("lines");

        const trackId = Number(trackIdRaw);
        const linesParam = typeof linesRaw === "string" ? linesRaw : "";

        if (!trackId || !linesParam) {
            return NextResponse.json(
                { error: "trackId and lines are required" },
                { status: 400 }
            );
        }

        let indices = linesParam
            .split(",")
            .map((v) => Number(v))
            .filter((n) => !Number.isNaN(n));

        if (indices.length === 0 || indices.length > 4) {
            return NextResponse.json(
                { error: "Invalid line selection" },
                { status: 400 }
            );
        }

        indices = Array.from(new Set(indices)).sort((a, b) => a - b);
        const consecutive = indices.every(
            (idx, i) => i === 0 || idx === indices[i - 1] + 1
        );

        if (!consecutive) {
            return NextResponse.json(
                { error: "Lines must be consecutive" },
                { status: 400 }
            );
        }

        const pool = getPool();

        const trackRes = await pool.query<{ lyrics: string | null }>(
            `
        SELECT lyrics
        FROM tracks
        WHERE id = $1
        `,
            [trackId]
        );

        if (trackRes.rowCount === 0) {
            return NextResponse.json(
                { error: "Track not found" },
                { status: 404 }
            );
        }

        const allLines =
            trackRes.rows[0].lyrics
                ?.split(/\r?\n/)
                .filter((line) => line.trim().length > 0) ?? [];

        if (indices.some((i) => i < 0 || i >= allLines.length)) {
            return NextResponse.json(
                { error: "Invalid line indices" },
                { status: 400 }
            );
        }

        const quoteText = indices.map((i) => allLines[i]).join("\n");

        const insertRes = await pool.query<Quote>(
            `
        INSERT INTO quotes (lyric, when_quoted, track_id, user_id)
        VALUES ($1, NOW(), $2, $3)
        RETURNING
          id,
          lyric,
          when_quoted AS "date",
          track_id    AS "trackId",
          user_id     AS "userId"
        `,
            [quoteText, trackId, userId]
        );

        const newQuote = insertRes.rows[0];
        return NextResponse.json(newQuote, { status: 201 });
    } catch (error) {
        console.error("POST /api/quotes error:", error);
        return NextResponse.json(
            { error: "Failed to create quote" },
            { status: 500 }
        );
    }
}
