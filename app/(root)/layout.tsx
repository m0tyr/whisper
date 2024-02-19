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
          <TopBar />
          <section className="main-container">
            <div className=" w-7/12 max-w-xl max-xl:w-4/5 max-lg:w-full">
              {children}

            </div>
          </section>
        </body>
      </html>
    </ClerkProvider>
  );
}
