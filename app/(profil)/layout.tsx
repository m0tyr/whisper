import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/Providers/Providers";
import { auth } from "@/auth";
import localfont from "next/font/local"

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Whisper",
  description: "a social app concept"
}


const code2001 = localfont({
  src: [
    {
      path : '../../public/fonts/Code2001-Mdge.ttf',
      weight: '400'
    }
  ],
  variable: '--font-code2001'
})

const peristiwa = localfont({
  src: [
    {
      path : '../../public/fonts/AndalosRegular-rv8V7.otf',
      weight: '400'
    }
  ],
  variable: '--font-andalos'
})

const helvetica = localfont({
  src: [
    {
      path : '../../public/fonts/Helvetica.ttf',
      weight: 'normal'
    }
  ],
  variable: '--font-helvetica'
})


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const fonts = [
    code2001.variable,
    peristiwa.variable,
    helvetica.variable
  ]

  const fontClasses = fonts.join(' ');
  return (
    <html lang="fr">
      <body className={fontClasses}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}