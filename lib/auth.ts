// lib/auth.ts
import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInSchema } from "./validation/auth-validate";
import { generateBaseUsername } from "./helper";
import { ensureUniqueUsername } from "@/app/actions/auth.action";
import { authConfig } from "./auth.config";

import { prisma } from "./prismadb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma as any), // ✅ CORREGIDO: usa la instancia 'prisma'
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = await signInSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.hashedPassword) return null;

        const isMatch = await bcrypt.compare(password, user.hashedPassword);

        if (isMatch) {
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, profile }) {
      if (trigger === "signUp" && profile) {
        const baseUsername = generateBaseUsername(profile.name || "user", profile.email || "");
        const uniqueUsername = await ensureUniqueUsername(baseUsername);
        token.username = uniqueUsername;
      }

      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});
