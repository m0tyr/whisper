import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"

import { Inter } from "next/font/google";
import "../globals.css";

import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Whisper",
  description: "a social app concept"
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

        <html lang="fr">
          <body className={inter.className}>

            {children}
            <Toaster />


          </body>
        </html>

    </ClerkProvider>
  );
}
