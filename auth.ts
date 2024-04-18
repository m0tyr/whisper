import NextAuth, { NextAuthConfig } from "next-auth"
import authConfig from "./auth.config"

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut } = NextAuth(authConfig)