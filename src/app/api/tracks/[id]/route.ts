// app/api/tracks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { Track } from "@/lib/types";
import { requireAdmin, requireUser } from "@/lib/auth-guards";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const sessionOrResponse = await requireUser();
        if (sessionOrResponse instanceof NextResponse) {
            return sessionOrResponse;
        }

        const pool = getPool();
        const res = await pool.query<Track>(
            `
      SELECT
        id,
        album_id  AS "albumId",
        title,
        number,
        video_url AS "video",
        lyrics
      FROM tracks
      WHERE id = $1
      `,
            [(await context.params).id]
        );

        if (res.rowCount === 0) {
            return NextResponse.json({ error: "Track not found" }, { status: 404 });
        }

        return NextResponse.json(res.rows[0]);
    } catch (error) {
        console.error("GET /api/tracks/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to fetch track" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const sessionOrResponse = await requireAdmin();
        if (sessionOrResponse instanceof NextResponse) {
            return sessionOrResponse;
        }
        const body = (await request.json()) as Partial<Track>;

        if (
            !body.albumId ||
            !body.title ||
            body.number === undefined ||
            body.video === undefined ||
            body.lyrics === undefined
        ) {
            return NextResponse.json(
                { error: "albumId, title, number, video, and lyrics are required" },
                { status: 400 }
            );
        }

        const pool = getPool();
        const res = await pool.query<Track>(
            `
      UPDATE tracks
      SET
        album_id  = $1,
        title     = $2,
        number    = $3,
        video_url = $4,
        lyrics    = $5
      WHERE id   = $6
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
                body.video,
                body.lyrics,
                (await context.params).id,
            ]
        );

        if (res.rowCount === 0) {
            return NextResponse.json({ error: "Track not found" }, { status: 404 });
        }

        return NextResponse.json(res.rows[0]);
    } catch (error) {
        console.error("PUT /api/tracks/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update track" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const sessionOrResponse = await requireAdmin();
        if (sessionOrResponse instanceof NextResponse) {
            return sessionOrResponse;
        }
        const pool = getPool();
        const res = await pool.query("DELETE FROM tracks WHERE id = $1 RETURNING id", [
            (await context.params).id,
        ]);

        if (res.rowCount === 0) {
            return NextResponse.json({ error: "Track not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Track deleted" });
    } catch (error) {
        console.error("DELETE /api/tracks/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete track" },
            { status: 500 }
        );
    }
}
