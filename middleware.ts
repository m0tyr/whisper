import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
import { API_AUTH_ROUTES, AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from './routes';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const nextUrl = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const isAPIROUTE = nextUrl.pathname.startsWith(API_AUTH_ROUTES);
    const isAUTHROUTE = AUTH_ROUTES.includes(nextUrl.pathname);
    console.log("Route: ", req.nextUrl.pathname);
    console.log("Login Status: ", isLoggedIn);
    if (isAPIROUTE) {
        return;
    }
    if (isAUTHROUTE) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return ;
    }
    if (!isLoggedIn && !isAUTHROUTE) {
        return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }
    return;
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};