import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
export const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth
    console.log("Route: ", req.nextUrl.pathname)
    console.log("Login Status: ", isLoggedIn)
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};