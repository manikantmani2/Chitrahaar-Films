import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
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
    signIn: '/admin/feedback',
  },
};
