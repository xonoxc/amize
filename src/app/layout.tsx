import type { Metadata } from "next"
import localFont from "next/font/local"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import React from "react"
import { AuthProvider } from "@/context/AuthProvider"

const sfpro = localFont({
    src: "../../public/fonts/sf-pro-display_regular.woff2",
})

export const metadata: Metadata = {
    title: "Amize",
    description:
        "application for reciving anonymouse feedbacks from your enemies",
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body className={sfpro.className}>
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <main>{children}</main>
                        <Toaster />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
