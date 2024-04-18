import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/db"
export default {
    providers: [
        Google,
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req) {
                console.log(credentials.email)
                console.log(credentials.password)
                return null;
            },
        }),
    ],
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const { pathname, search } = nextUrl;
            const isLoggedIn = !!auth?.user;
            const isOnAuthPage =
                pathname.startsWith('/sign-in') || pathname.startsWith('/sign-in');
            if (isOnAuthPage) {
                if (isLoggedIn) return NextResponse.redirect(new URL('/', nextUrl));
            } else {
                if (!isLoggedIn) {
                    console.log(auth)
                    console.log(nextUrl)
                    const from = encodeURIComponent(pathname + search); // The /sign-in page shall then use this `from` param as a `callbackUrl` upon successful sign in
                    return NextResponse.redirect(new URL(`/sign-in?from=${from}`, nextUrl));
                }
            }

            // Don't redirect if on an unprotected page, or if logged in and is on a protected page
            return true;
        },
    },
    secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig;