import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"

import { Inter } from "next/font/google";
import "../globals.css";

import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/shared/Providers";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Whisper",
  description: "a social app concept"
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers session={session}>
          {children}
        </Providers>


      </body>
    </html>
  );
}