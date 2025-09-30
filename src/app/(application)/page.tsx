import CarouselMessages from "@/components/CarouselMessages"
import Footer from "@/components/Footer"
import Header from "@/components/Header"

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Main content */}
            <main
                className="flex-1
				flex flex-col items-center 
				justify-center px-5 py-24 
				bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#d5b9b2_100%)]"
            >
                <svg
                    d="M24 2 Q28 0 32 2 Q36 4 40 8 L40 52 Q40 56 36 60 Q32 62 28 60 Q24 58 20 60 Q16 62 12 60 Q8 56 8 52 L8 8 Q8 4 12 2 Q16 0 20 2 Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="rgba(255,255,255,0.04)"
                    className="backdrop-blur-md"
                >
                    <defs>
                        <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
                            <stop
                                offset="0%"
                                stopColor="#bf24ba"
                                stopOpacity="0.3"
                            />
                            <stop
                                offset="100%"
                                stopColor="#000000"
                                stopOpacity="0.8"
                            />
                        </radialGradient>
                        <filter id="blur1">
                            <feGaussianBlur
                                in="SourceGraphic"
                                stdDeviation="80"
                            />
                        </filter>
                    </defs>
                    <path
                        d="M421.5,0 C552,50 600,200 500,350 C400,500 200,450 150,300 C100,150 200,50 350,0 Z"
                        fill="url(#grad1)"
                        filter="url(#blur1)"
                        transform="translate(100 50) scale(1.2)"
                    />
                </svg>
                <Header />
                {/* Carousel for Messages */}
                <CarouselMessages />

                {/* Footer */}
                <Footer />
            </main>
        </div>
    )
}
