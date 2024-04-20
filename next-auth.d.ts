import { DefaultSession } from "next-auth";


export type FullUserAuth = DefaultSession["user"] & {
    role : "ADMIN" | "USER"
}

declare module "next-auth" {
    interface Session{
        user : FullUserAuth
    }
}