import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"

import { Inter } from "next/font/google";
import "../globals.css";
import TopBar from "@/components/shared/Topbar";
import CreateWhisper from "@/components/forms/CreateWhisper";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  icons: {
    icon: "/icon.png",
    },
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

            
        </body>
      </html>
    </ClerkProvider>
  );
}
