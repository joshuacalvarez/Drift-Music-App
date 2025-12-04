import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: number;
      role?: "admin" | "user";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "admin" | "user";
  }

}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    dbUserId?: number;
    role?: "admin" | "user";
  }
}
