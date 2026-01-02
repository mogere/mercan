import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/../db";
import { users } from "@/../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1);

          if (!user || user.length === 0) {
            return null;
          }

          const foundUser = user[0];

          if (!foundUser.passwordHash) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            foundUser.passwordHash
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: foundUser.id.toString(),
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (trigger === "update" && session) {
        if (session.name) {
          token.name = session.name;
        }
        if (session.email) {
          token.email = session.email;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
