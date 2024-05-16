'use client';

import { ReactQueryProvider } from "@/contexts/react_query.provider";
import { Toaster } from "../ui/toaster";
import { SessionProvider } from "next-auth/react";
import type { Session } from 'next-auth';


export function Providers({
    children,
    session,
  }: {
    children: React.ReactNode;
    session: Session | null;
  }) {
    return (

        <ReactQueryProvider>
            <SessionProvider session={session}>
                {children}
                <Toaster />
            </SessionProvider>
        </ReactQueryProvider>
    );
}