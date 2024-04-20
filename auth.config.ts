import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from "next-auth/providers/google"


export default {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-in',
        newUser: '/onboarding'
    },

    secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig;