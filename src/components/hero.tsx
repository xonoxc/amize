"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MessagesCarousel } from "@/components/messages_carousel"
import { IsoGrid } from "@/components/iso-background"
import NavBar from "./Navbar"
import { useRouter } from "next/navigation"

export function Hero() {
    const router = useRouter()
    return (
        <section className="relative h-full w-full">
            <IsoGrid /> {/* decorative, code-based background (no images) */}
            {/* Container */}
            <div className="mx-auto h-full max-w-6xl px-6 py-16 md:py-24">
                {/* Simple top bar */}
                <div className="flex items-center justify-center mb-36">
                    <NavBar />
                </div>

                {/* Minimal hero */}
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm text-muted-foreground">
                        Honest messaging platform
                    </p>
                    <h1 className="text-pretty text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                        Beyond the{" "}
                        <span className={cn("text-[#d5b9b2]")}>
                            Sugarcoating
                        </span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
                        Let your words be your identity. Thoughtful, candid
                        conversations with privacy-first controls.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <Button
                            className="rounded-lg bg-[#d5b9b2] text-primary-foreground hover:bg-[#d5b9b2]/90"
                            onClick={() => router.push("/auth/sign-up")}
                        >
                            Get started
                        </Button>
                        <Button
                            onClick={() => router.push("/auth/sign-in")}
                            variant="outline"
                            className="rounded-lg bg-transparent"
                        >
                            Browse messages
                        </Button>
                    </div>

                    {/* Messages carousel */}
                    <MessagesCarousel className="mt-8" />
                </div>
            </div>
        </section>
    )
}
