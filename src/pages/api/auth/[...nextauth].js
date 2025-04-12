import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import authConfig, { getAllowedOrigins } from "../../../lib/auth-config";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        // Find user by email
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        // Check if user exists and password is correct
        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          throw new Error("Invalid email or password");
        }

        // Return user object without password
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to JWT token if user is present
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session object
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: authConfig.sessionMaxAge,
  },
  cookies: {
    sessionToken: {
      name: `${authConfig.cookiePrefix}.session-token`,
      options: {
        httpOnly: true,
        sameSite: authConfig.cookieSameSite,
        path: "/",
        secure: authConfig.cookieSecure,
        domain:
          process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
      },
    },
    callbackUrl: {
      name: `${authConfig.cookiePrefix}.callback-url`,
      options: {
        sameSite: authConfig.cookieSameSite,
        path: "/",
        secure: authConfig.cookieSecure,
        domain:
          process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
      },
    },
    csrfToken: {
      name: `${authConfig.cookiePrefix}.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: authConfig.cookieSameSite,
        path: "/",
        secure: authConfig.cookieSecure,
        domain:
          process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
      },
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET || "default-secret-key-change-in-production",
  debug: process.env.NODE_ENV === "development",
  // Ensure cookies can be sent in HTTPS environments
  useSecureCookies: authConfig.cookieSecure,
  // Enable CORS for authentication endpoints
  basePath: "/api/auth",
};

export default NextAuth(authOptions);
