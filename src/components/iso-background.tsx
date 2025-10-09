"use client"

import { cn } from "@/lib/utils"

export function IsoGrid({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-0 -z-10",
                "[mask-image:radial-gradient(90%_70%_at_50%_40%,black,transparent)]",
                className
            )}
            aria-hidden="true"
        >
            <svg
                className="h-full w-full text-muted-foreground"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    {/* Diagonal grid that evokes isometric guides */}
                    <pattern
                        id="iso-grid-a"
                        width="8"
                        height="8"
                        patternUnits="userSpaceOnUse"
                        patternTransform="skewY(30)"
                    >
                        <path
                            d="M 0 0 L 0 8"
                            stroke="currentColor"
                            strokeOpacity="0.08"
                            strokeWidth="0.25"
                        />
                    </pattern>
                    <pattern
                        id="iso-grid-b"
                        width="8"
                        height="8"
                        patternUnits="userSpaceOnUse"
                        patternTransform="skewY(-30)"
                    >
                        <path
                            d="M 0 0 L 0 8"
                            stroke="currentColor"
                            strokeOpacity="0.08"
                            strokeWidth="0.25"
                        />
                    </pattern>
                    {/* Sparse crosses to hint “technical drawing” */}
                    <pattern
                        id="iso-cross"
                        width="24"
                        height="24"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M12 9 L12 15 M9 12 L15 12"
                            stroke="currentColor"
                            strokeOpacity="0.12"
                            strokeWidth="0.3"
                        />
                    </pattern>
                </defs>

                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#iso-grid-a)"
                />
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#iso-grid-b)"
                />
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#iso-cross)"
                />
            </svg>
            {/* Subtle top-to-bottom fade to keep content readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
    )
}
