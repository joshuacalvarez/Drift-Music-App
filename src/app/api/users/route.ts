// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { User } from "@/lib/types";
import { requireAdmin } from "@/lib/auth-guards";

export const runtime = "nodejs";

export async function GET() {
    try {
        const sessionOrResponse = await requireAdmin();
        if (sessionOrResponse instanceof NextResponse) {
            return sessionOrResponse;
        }
        const pool = getPool();
        const res = await pool.query("SELECT * FROM Users");
        const users = res.rows as User[];

        return NextResponse.json(users);
    } catch (error) {
        console.error("GET /api/users error:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

// POST /api/users
export async function POST(request: NextRequest) {
    try {
        const sessionOrResponse = await requireAdmin();
        if (sessionOrResponse instanceof NextResponse) {
            return sessionOrResponse;
        }
        const body = (await request.json()) as Partial<User>;

        const pool = getPool();
        const res = await pool.query<User>(
            `
      INSERT INTO users (name, username, password, email)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
            [
                body.name ?? null,
                body.email ?? null,
            ]
        );

        const newUser = res.rows[0];
        return NextResponse.json(newUser, { status: 201 });

    } catch (error) {
        console.error("POST /api/users error:", error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}
