import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  providers: googleClientId && googleClientSecret
    ? [
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        }),
      ]
    : [],
  secret: process.env.NEXTAUTH_SECRET || process.env.ADMIN_SESSION_SECRET || 'chitrahaar-nextauth-secret',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      if (!process.env.ADMIN_EMAIL) {
        return false;
      }

      return user.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
    },
  },
  pages: {
    signIn: '/admin/login',
  },
};

