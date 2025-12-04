import NextAuth, {
  type NextAuthOptions,
  type Session,
  type Account,
  type Profile,
} from "next-auth";

import GitHubProvider from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";
import { getPool } from "@/lib/db";

async function findOrCreateUser(email: string, name?: string | null, username?: string | null) {
  const pool = getPool();

  const existing = await pool.query<{ id: number }>(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  );

  if (existing.rowCount ?? 0 > 0) {
    return existing.rows[0].id;
  }

  const inserted = await pool.query<{ id: number }>(
    `
      INSERT INTO users (email, name, username)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
    [email, name ?? null, username ?? null]
  );

  return inserted.rows[0].id;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile && typeof profile.email === "string") {
        token.email = profile.email;

        const dbUserId = await findOrCreateUser(
          profile.email,
          profile.name ?? null,
          (profile as any).login ?? null
        );

        (token as any).dbUserId = dbUserId;
      }

      const admins = (process.env.ADMIN_EMAILS ?? "").split(",");
      token.role = admins.includes(token.email ?? "") ? "admin" : "user";

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "admin" | "user" | undefined;

        (session.user as any).id = (token as any).dbUserId;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
