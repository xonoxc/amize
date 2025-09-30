"use client"

import { Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import { useRef } from "react"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

export default function CarouselMessages() {
    const plugin = useRef(
        Autoplay({
            delay: 4000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: false,
        })
    )

    return (
        <div className="w-full max-w-lg md:max-w-xl p-4">
            <Carousel
                plugins={[plugin.current]}
                className="w-full px-4"
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    {messages.map((message, index) => (
                        <CarouselItem key={index} className="px-4">
                            <Card className="bg-transparent backdrop-blur-8xl border border-white/20 transition-all duration-300 ease-in-out hover:border-white/40">
                                <CardHeader>
                                    <CardTitle className="text-white">
                                        {message.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4 text-white/90">
                                    <Mail className="flex-shrink-0 text-white/80" />
                                    <div className="min-w-0 flex-1">
                                        <p className="break-words">
                                            {message.content}
                                        </p>
                                        <p className="text-xs text-white/50 mt-1">
                                            {message.received}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
