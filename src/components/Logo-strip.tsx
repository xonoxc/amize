export function LogoStrip() {
    const items = [
        { alt: "Nordic", w: 88 },
        { alt: "Convendum", w: 104 },
        { alt: "Vattenfall", w: 96 },
        { alt: "Foundation", w: 110 },
        { alt: "Texas Labs", w: 90 },
        { alt: "BrightBid", w: 98 },
    ]
    return (
        <section aria-label="Trusted by" className="border-t border-border/60">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <div className="grid grid-cols-2 items-center gap-6 opacity-70 grayscale md:grid-cols-6">
                    {items.map((it, i) => (
                        <img
                            key={i}
                            src={`/ceholder-svg-height-24-width-.jpg?height=24&width=${it.w}&query=logo%20${encodeURIComponent(it.alt)}`}
                            alt={`${it.alt} logo`}
                            className="mx-auto h-6 w-auto"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
