import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { requireUser } from "@/lib/auth-guards";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ email: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const sessionOrResponse = await requireUser();
    if (sessionOrResponse instanceof NextResponse) {
      return sessionOrResponse; // 401 if not logged in
    }
    const session = sessionOrResponse;

    const { email: requestedEmail } = await context.params;
    const sessionEmail = session.user.email ?? "";
    const isAdmin = session.user.role === "admin";
    const isOwner =
      sessionEmail.toLowerCase() === requestedEmail.toLowerCase();

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "You are not allowed to view these quotes" },
        { status: 403 }
      );
    }

    const pool = getPool();

    const res = await pool.query(
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
      WHERE u.email = $1
      ORDER BY q.when_quoted DESC
      `,
      [requestedEmail]
    );

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("GET /api/quotes/user/[email] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user quotes" },
      { status: 500 }
    );
  }
}
