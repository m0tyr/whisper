import NextAuth, { NextAuthConfig } from "next-auth"
import authConfig from "@/auth.config"
import { LoginSchema } from './lib/validations/auth';
import { connectToDB } from "./lib/mongoose";
import User from "./lib/models/user.model";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/db";
import type { Adapter } from "@auth/core/adapters"
import { Register, fetchUserbyEmail, findOrganicAuthUserPass } from "./lib/actions/user.actions";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

async function getUser(id: string, name: string,email: string): Promise<any> {
    return {
        id: 1,
        name: 'test user',
        email: email,
    };
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    unstable_update
 } = NextAuth({
        ...authConfig,
        providers: [
            CredentialsProvider({
                name: 'credentials',
                credentials: {
                    email: { label: "Email", type: "text", placeholder: "jsmith" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials, req) {
                    try {
                        connectToDB();
                        const user = await findOrganicAuthUserPass(credentials.email as string)
                        console.log("Authorize User Credentials: ", user);
                        if (user !== null) {
                            const res = await bcrypt.compare(credentials.password, user.password)
                            if (res === true) {
                                const myuser = getUser(user._id.toString(),user.username as string, user.email  as string)
                                console.log("UserAccount created: ", myuser);
                                return myuser;
                            } else {
                                console.log("Wrong password");
                                return null;
                            }
                        } else {
                            const createuser = await Register(credentials.email as string, credentials.password as string)
                            console.log(createuser)
                            return null;
                        }
                    } catch (err) {
                        console.log("authorize error :", err);
                    }
                }
            }),
            ...authConfig.providers,
        ],
        adapter : <Adapter>MongoDBAdapter(clientPromise),
        session: {
            strategy: 'jwt',
        },
        events : {
            async linkAccount({user}: any){
                connectToDB();
                await User.findOneAndUpdate(
                    {email: user.email},
                    { 
                        emailVerified: new Date(),
                        isOAuth: true
                    })
            }
        },
        callbacks: {
            async session ({token, session}: any) {
                if(token.sub && session.user){
                    session.user.id = token.sub;
                }
                if(token.role && session.user){
                    session.user.role = token.role as "ADMIN" | "USER";
                }
                console.log(session)
                console.log("sessiontoken : ", token)
                return session;
            },
            async jwt ({token}: any) {
                if(!token.sub) return token 
                //hard coded atm
                token.role = "USER"
                return token;
            },
            async authorized({ auth, request: { nextUrl } }: any) {
                const isLoggedIn = !!auth?.user;
                const isOnProtected = !(nextUrl.pathname.startsWith('/sign-in'));
                console.log(isLoggedIn)
                if (isOnProtected) {
                    if (isLoggedIn) return true;
                    return false; // redirect to /sign-in
                } else if (isLoggedIn) {
                    // redirected to homepage
                    return Response.redirect(new URL('/', nextUrl));
                }
                return true;
            },
        },
        })