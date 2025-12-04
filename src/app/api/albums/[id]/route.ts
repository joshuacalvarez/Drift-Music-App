import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { Album, Track } from "@/lib/types";
import { requireAdmin, requireUser } from "@/lib/auth-guards";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/albums/[id]
export async function GET(request: NextRequest, context: RouteContext) {
  const sessionOrResponse = await requireUser();
  if (sessionOrResponse instanceof NextResponse) {
    return sessionOrResponse;
  }

  const { id } = await context.params;
  const albumId = Number(id);

  if (!Number.isInteger(albumId)) {
    return NextResponse.json({ error: "Invalid album ID" }, { status: 400 });
  }

  try {
    const pool = getPool();

    const albumRes = await pool.query("SELECT * FROM albums WHERE id = $1", [
      albumId,
    ]);

    if (albumRes.rowCount === 0) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const tracksRes = await pool.query(
      "SELECT * FROM tracks WHERE album_id = $1 ORDER BY number",
      [albumId]
    );

    const tracks = tracksRes.rows.map((t: any) => ({
      id: t.id,
      albumId: t.album_id,
      number: t.number,
      title: t.title,
      lyrics: t.lyrics,
      video: t.video_url,
    }));

    const row = albumRes.rows[0];

    const result: Album = {
      id: row.id,
      title: row.title,
      artist: row.artist,
      year: row.year,
      image: row.image,
      description: row.description,
      tracks,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(`GET /api/albums/${id} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch album" },
      { status: 500 }
    );
  }
}

// PUT /api/albums/[id] (update album + create/update tracks)
export async function PUT(request: NextRequest, context: RouteContext) {
  const sessionOrResponse = await requireAdmin();
  if (sessionOrResponse instanceof NextResponse) {
    return sessionOrResponse;
  }

  const { id } = await context.params;
  const albumId = Number(id);

  if (!Number.isInteger(albumId)) {
    return NextResponse.json({ error: "Invalid album ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, artist, year, description, image, tracks } = body as {
      title?: string;
      artist?: string;
      year?: number;
      description?: string | null;
      image?: string | null;
      tracks?: Track[];
    };

    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updateRes = await client.query(
        `
        UPDATE albums
        SET title = $1,
            artist = $2,
            year = $3,
            description = $4,
            image = $5
        WHERE id = $6
        RETURNING *
        `,
        [title, artist, year, description ?? null, image ?? null, albumId]
      );

      if (updateRes.rowCount === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "Album not found" }, { status: 404 });
      }

      if (Array.isArray(tracks)) {
        for (const t of tracks) {
          // Skip completely empty rows
          if (t.title == null || t.number == null) continue;

          if (t.id != null) {
            // Existing track → UPDATE
            await client.query(
              `
              UPDATE tracks
              SET number = $1,
                  title = $2,
                  lyrics = $3,
                  video_url = $4
              WHERE id = $5 AND album_id = $6
              `,
              [t.number, t.title, t.lyrics ?? null, t.video ?? null, t.id, albumId]
            );
          } else {
            await client.query(
              `
              INSERT INTO tracks (album_id, title, number, lyrics, video_url)
              VALUES ($1, $2, $3, $4, $5)
              `,
              [albumId, t.title, t.number, t.lyrics ?? null, t.video ?? null]
            );
          }
        }
      }

      await client.query("COMMIT");

      return NextResponse.json({ message: "Album updated successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(`PUT /api/albums/${id} transaction error:`, err);
      return NextResponse.json(
        { error: "Failed to update album and tracks" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`PUT /api/albums/${id} parse error:`, error);
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 }
    );
  }
}

// DELETE /api/albums/[id]
export async function DELETE(request: NextRequest, context: RouteContext) {
  const sessionOrResponse = await requireAdmin();
  if (sessionOrResponse instanceof NextResponse) {
    return sessionOrResponse;
  }

  const { id } = await context.params;
  const albumId = Number(id);

  if (!Number.isInteger(albumId)) {
    return NextResponse.json({ error: "Invalid album ID" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const del = await pool.query(
      "DELETE FROM albums WHERE id = $1 RETURNING id",
      [albumId]
    );

    if (del.rowCount === 0) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Album ${albumId} deleted` });
  } catch (error) {
    console.error(`DELETE /api/albums/${id} error:`, error);
    return NextResponse.json(
      { error: "Failed to delete album" },
      { status: 500 }
    );
  }
}
