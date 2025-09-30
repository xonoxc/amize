"use client"

import React from "react"
import Link from "next/link"
import { Blend, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User } from "next-auth"
import { useSession, signOut } from "next-auth/react"

export default function NavBar() {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className="p-4 md:p-6 bg-transparent backdrop-blur-2xl dark:text-white fixed w-full top-0 z-50">
            <div className="container flex flex-row  justify-center items-center">
                <div className="session flex items-center justify-between gap-2 border border-green w-full sm:w-2/3 p-4 rounded-lg border-dashed">
                    <div className="flex items-center pt-2 sm:pt-0">
                        <a
                            href="#"
                            className="text-xl fond-bold mb-4 md:mb-0 font-bold flex gap-2"
                        >
                            <span>
                                <Blend color="#bf24ba" />
                            </span>
                            Amize
                        </a>
                    </div>

                    <div>
                        {session ? (
                            <>
                                <span className="mr-4">
                                    Welcome , {user.username || user.email}
                                </span>
                                <Button
                                    onClick={() => signOut()}
                                    className="w-full md:w-auto bg-slate-100 text-black"
                                    variant={"outline"}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href={"/auth/sign-in"}>
                                <Button
                                    className="w-full font-bold md:w-auto bg-slate-100 text-black text-md flex items-center justify-center gap-2"
                                    variant={"outline"}
                                >
                                    <Key className="size-4" strokeWidth={3} />
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
