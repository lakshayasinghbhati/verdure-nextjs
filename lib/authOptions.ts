import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email & password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user || !user.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
  if (account?.provider === "google" && token.email) {
    await connectDB();

    const dbUser = await User.findOne({
      email: token.email.toLowerCase(),
    });

    if (dbUser) {
      token.id = dbUser._id.toString();
      token.role = dbUser.role || "customer";
    }
  } else if (user) {
    token.id = (user as any).id;
    token.role = (user as any).role || "customer";
  }

  if (!user && token.email) {
    await connectDB();

    const dbUser = await User.findOne({
      email: token.email.toLowerCase(),
    });

    if (dbUser) {
      token.id = dbUser._id.toString();
      token.role = dbUser.role || "customer";
    }
  }

  return token;
},
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async signIn({ user, account }) {
      console.log("GOOGLE SIGN-IN EMAIL:", user.email);
console.log("GOOGLE SIGN-IN ID:", user.id);
      if (account?.provider === "google") {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({ name: user.name, email: user.email, image: user.image });
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
