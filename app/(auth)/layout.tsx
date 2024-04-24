import { Inter } from "next/font/google"
import '../globals.css'
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
        <body className={`${inter.className} relative`}>
            <Toaster />
                {children}
        </body>
    </html>
    )
}