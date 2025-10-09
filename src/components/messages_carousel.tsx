"use client"

import * as React from "react"
import { Mail } from "lucide-react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"

import messages from "@/messages.json"

export function MessagesCarousel({ className }: { className?: string }) {
    const [api, setApi] = React.useState<CarouselApi | null>(null)
    const [index, setIndex] = React.useState(0)
    const [count, setCount] = React.useState(0)
    const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

    const stop = React.useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    const start = React.useCallback(() => {
        if (!api || timerRef.current) return
        timerRef.current = setInterval(() => api.scrollNext(), 4000)
    }, [api])

    React.useEffect(() => {
        if (!api) return
        const onSelect = () => setIndex(api.selectedScrollSnap())
        setCount(api.scrollSnapList().length)
        onSelect()
        api.on("select", onSelect)
        api.on("reInit", onSelect)
        start()
        return () => {
            api.off("select", onSelect)
            api.off("reInit", onSelect)
            stop()
        }
    }, [api, start, stop])

    const plugin = React.useRef(
        Autoplay({
            delay: 4000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: false,
        })
    )

    return (
        <div
            className={cn("w-full", className)}
            onMouseEnter={stop}
            onMouseLeave={start}
            onFocusCapture={stop}
            onBlurCapture={start}
        >
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                opts={{ align: "center", loop: true }}
                className="relative mx-auto max-w-2xl"
            >
                <CarouselContent>
                    {messages.map((m, i) => (
                        <CarouselItem key={i}>
                            <article
                                className="rounded-2xl border border-border/60 bg-card/15 p-5 shadow-[0_0_0_1px_hsl(var(--border)_/_30%)] backdrop-blur supports-[backdrop-filter]:bg-card/25"
                                aria-label={`Message ${i + 1} of ${messages.length}`}
                            >
                                <header className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail
                                        className="h-4 w-4 text-[#d5b9b2]"
                                        aria-hidden
                                        strokeWidth={2}
                                    />
                                    <span>
                                        Message from{" "}
                                        <span className="text-[#d5b9b2]">
                                            {m.title}
                                        </span>
                                    </span>
                                </header>
                                <p className="text-sm leading-relaxed text-foreground">
                                    {m.content}
                                </p>
                                <footer className="mt-3 text-xs text-muted-foreground">
                                    {m.received}
                                </footer>
                            </article>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>

            {/* Dots */}
            <div className="mt-4 flex items-center justify-center gap-2">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => api?.scrollTo(i)}
                        aria-label={`Go to message ${i + 1}`}
                        className={cn(
                            "h-1.5 w-5 rounded-full bg-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            i === index ? "bg-primary" : "hover:bg-muted"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
