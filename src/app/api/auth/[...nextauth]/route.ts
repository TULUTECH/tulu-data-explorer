import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { UserRoles } from "@/types/userTypes";

// TODO: Move to a real database
const users = [
  {
    id: "1",
    username: process.env.NEXTAUTH_USERNAME,
    password: process.env.NEXTAUTH_PASSWORD,
    name: process.env.NEXTAUTH_NAME,
    email: process.env.NEXTAUTH_EMAIL,
    role: UserRoles.Admin,
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Find the user in our "database"
        const user = users.find(
          (user) =>
            user.username === credentials?.username &&
            user.password === credentials?.password,
        );
        if (user) {
          // Return user data without the password
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // When signing in, add user data to the token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // Only assign if role exists
        if (user.role) {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data from token to the session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        if (token.role) {
          session.user.role = token.role;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret-for-development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
