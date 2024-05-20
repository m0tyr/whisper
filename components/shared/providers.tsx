'use client';

import { ReactQueryProvider } from "@/contexts/react_query.provider";
import { Toaster } from "../ui/toaster";
import { SessionProvider } from "next-auth/react";
import type { Session } from 'next-auth';
import { CreateWhisperContextProvider } from "@/contexts/create_whisper.provider";
import { DialogContextProvider } from "@/contexts/dialog.provider";


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
        <CreateWhisperContextProvider>
          {children}
          <Toaster />
        </CreateWhisperContextProvider>
        </DialogContextProvider>
      </SessionProvider>
    </ReactQueryProvider>
  );
}