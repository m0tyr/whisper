import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';
import { LoginSchema } from './lib/validations/auth';
import { Register } from './lib/actions/user.actions';
import clientPromise from './lib/db';

async function getUser(email: string, password: string): Promise<any> {
    return {
        id: 1,
        name: 'test user',
        email: email,
        password: password,
    };
}

export default {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = await getUser(
                    credentials.email as string,
                    credentials.password as string
                );
                return user ?? null;
            },
        }),
    ],
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-in',
        newUser: '/onboarding'
    },

    secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig;