import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/shared/providers";

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
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>


      </body>
    </html>
  );
}