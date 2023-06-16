import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import { DefaultSession } from "next-auth";

// declare Session to have an id
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** User CUID. */
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    // Cookies sessions does not work with credentials provider
    // https://stackoverflow.com/questions/72090328/next-auth-credentials-not-returning-session-and-not-storing-session-and-account
    strategy: "jwt",
    maxAge: 3000,
  },
  providers: [
    /*
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    */
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        if (!credentials) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.username,
          },
          include: {
            CredentialPassword: true,
          },
        });

        if (!user) {
          return null;
        }

        if (!user.CredentialPassword) {
          // LOG AN ERROR HERE!
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.CredentialPassword.password
        );

        if (!isPasswordValid) {
          return null;
        }

        const userJWT = { id: user.id, name: user.name, email: user.email };

        return userJWT;
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    // @ts-ignore
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // @ts-ignore
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
