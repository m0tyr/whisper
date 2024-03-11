import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import '../globals.css'
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Connexion • Whisper",
    description: "a social app concept"
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="fr">
                <body className={`${inter.className} bg-insanedark`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}