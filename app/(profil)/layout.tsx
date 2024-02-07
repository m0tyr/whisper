import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"

import { Inter } from "next/font/google";
import "../globals.css";
import TopBar from "@/components/shared/Topbar";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  icons: {
    icon: "/icon.png",
    },
  title: "Paramètres • Whisper",
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
          <TopBar />
          <section className="main-container">
          <div className="w-2/5 max-w-xl max-lg:w-full">
              {children}

            </div>
          </section>
        </body>
      </html>
    </ClerkProvider>
  );
}