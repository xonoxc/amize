import { Hero } from "@/components/hero"

export default function Page() {
    return (
        <>
            <Hero />
            <footer className="mx-auto max-w-6xl px-6 py-12 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Amize. All rights reserved.
            </footer>
        </>
    )
}
