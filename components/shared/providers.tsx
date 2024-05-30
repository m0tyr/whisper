'use client';

import { Toaster } from "../ui/toaster";
import { SessionProvider } from "next-auth/react";
import type { Session } from 'next-auth';
import { DialogContextProvider } from "@/contexts/DialogContext";
import { ReactQueryProvider } from "@/contexts/ReactQueryCustomProvider";
import { CreateWhisperModalContextProvider } from "@/contexts/CreateWhisperModalContext";


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
        <DialogContextProvider>
        <CreateWhisperModalContextProvider>
          {children}
          <Toaster />
        </CreateWhisperModalContextProvider>
        </DialogContextProvider>
      </SessionProvider>
    </ReactQueryProvider>
  );
}