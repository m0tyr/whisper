import { Inter } from "next/font/google"
import '../globals.css'
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

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
            <html lang="fr">
                <body className={`${inter.className} bg-insanedark`}>
                    <Toaster />

                    {children}
                </body>
            </html>
    )
}