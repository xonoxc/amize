import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import React from "react"
import { AuthProvider } from "@/context/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

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
            <body className={inter.className}>
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
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
