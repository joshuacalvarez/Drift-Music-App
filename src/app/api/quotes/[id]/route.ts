// app/api/quotes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { Quote } from "@/lib/types";
import { requireAdmin, requireUser } from "@/lib/auth-guards";

export const runtime = "nodejs";

// GET /api/quotes/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const sessionOrResponse = await requireUser();
    if (sessionOrResponse instanceof NextResponse) {
      return sessionOrResponse;
    }

    const { id } = params;
    const quoteId = Number(id);

    if (!Number.isInteger(quoteId)) {
      return NextResponse.json({ error: "Invalid quote ID" }, { status: 400 });
    }

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
      LEFT JOIN users  u ON q.user_id = u.id
      WHERE q.id = $1
      `,
      [quoteId]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("GET /api/quotes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

// PUT /api/quotes/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionOrResponse = await requireUser();
    if (sessionOrResponse instanceof NextResponse) {
      return sessionOrResponse;
    }
    const session = sessionOrResponse;

    const { id } = params;
    const quoteId = Number(id);

    if (!Number.isInteger(quoteId)) {
      return NextResponse.json({ error: "Invalid quote ID" }, { status: 400 });
    }

    const pool = getPool();

    const quoteRes = await pool.query(
      `
      SELECT q.id, q.user_id, u.email
      FROM quotes q
      JOIN users u ON q.user_id = u.id
      WHERE q.id = $1
      `,
      [quoteId]
    );

    if (quoteRes.rowCount === 0) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const quote = quoteRes.rows[0];

    const isAdmin = session.user.role === "admin";
    const isOwner = quote.email === session.user.email;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "You are not allowed to delete this quote" },
        { status: 403 }
      );
    }

    await pool.query("DELETE FROM quotes WHERE id = $1", [quoteId]);

    return NextResponse.json({ message: "Quote deleted" });
  } catch (error) {
    console.error("DELETE /api/quotes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete quote" },
      { status: 500 }
    );
  }
}