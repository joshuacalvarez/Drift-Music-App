// app/api/tracks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { Track } from "@/lib/types";
import { requireAdmin, requireUser } from "@/lib/auth-guards";

export const runtime = "nodejs";

export async function GET() {
    try {
        const sessionOrResponse = await requireUser();
        if (sessionOrResponse instanceof NextResponse) {
            return sessionOrResponse;
        }
        const pool = getPool();
        const res = await pool.query(
            `
      SELECT
        id,
        album_id  AS "albumId",
        title,
        number,
        video_url AS "video",
        lyrics
      FROM tracks
      ORDER BY album_id, number
      `
        );

        const tracks = res.rows as Track[];
        return NextResponse.json(tracks);
    } catch (error) {
        console.error("GET /api/tracks error:", error);
        return NextResponse.json(
            { error: "Failed to fetch tracks" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const sessionOrResponse = await requireAdmin();
        if (sessionOrResponse instanceof NextResponse) {
            return sessionOrResponse;
        }
        const body = (await request.json()) as Partial<Track>;

        if (!body.albumId || !body.title || body.number === undefined) {
            return NextResponse.json(
                { error: "albumId, title, and number are required" },
                { status: 400 }
            );
        }

        const pool = getPool();
        const res = await pool.query<Track>(
            `
      INSERT INTO tracks (album_id, title, number, video_url, lyrics)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        album_id  AS "albumId",
        title,
        number,
        video_url AS "video",
        lyrics
      `,
            [
                body.albumId,
                body.title,
                body.number,
                body.video ?? "",
                body.lyrics ?? "",
            ]
        );

        const newTrack = res.rows[0];
        return NextResponse.json(newTrack, { status: 201 });
    } catch (error) {
        console.error("POST /api/tracks error:", error);
        return NextResponse.json(
            { error: "Failed to create track" },
            { status: 500 }
        );
    }
}
