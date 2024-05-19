'use client';

import { ReactQueryProvider } from "@/contexts/react_query.provider";
import { Toaster } from "../ui/toaster";
import { SessionProvider } from "next-auth/react";
import type { Session } from 'next-auth';
import { ModalContextProvider } from "@/contexts/create_post.provider";


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
        <ModalContextProvider>
          {children}
          <Toaster />
        </ModalContextProvider>
      </SessionProvider>
    </ReactQueryProvider>
  );
}