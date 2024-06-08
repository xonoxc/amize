"use client"
import { z } from "zod"
import Link from "next/link"
import { useDebounce } from "use-debounce"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useEffect, useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { signupSchema } from "@/validation/singupSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

export default function LoginForm() {
    const [username, setUsername] = useState<string>("")
    const [usernameMessage, setUsernameMessage] = useState<string>("")
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [debouncedUsername] = useDebounce(username, 3000)

    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    const checkUniqueUsername = useCallback(async () => {
        if (debouncedUsername) {
            setIsCheckingUsername(true)
            setUsernameMessage("")
            try {
                const response = await axios.get<ApiResponse>(
                    `/api/username-availabilty?username=${debouncedUsername}`
                )
                setUsernameMessage(response.data.message)
            } catch (error) {
                const AxiosError = error as AxiosError<ApiResponse>
                setUsernameMessage(
                    AxiosError.response?.data.message ??
                        "Error while checking the username!"
                )
            } finally {
                setIsCheckingUsername(false)
            }
        }
    }, [debouncedUsername])

    useEffect(() => {
        checkUniqueUsername()
    }, [debouncedUsername, checkUniqueUsername])

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>("/api/signup", data)

            toast({
                title: "Success",
                description: response.data.message,
            })

            router.replace(`/verify/${username}`)

            setIsSubmitting(false)
        } catch (error) {
            console.error("Error while signing-up", error)

            const axiosError = error as AxiosError<ApiResponse>

            let message =
                axiosError.response?.data.message ||
                "There was an error signing-up. Please try again later!"

            toast({
                title: "Sign Up Failed!",
                description: message,
                variant: "destructive",
            })

            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen border-nonwe">
            <div className="w-full max-w-md p-8 space-y-8  ">
                <div className="text-center">
                    <h1 className="text-xl font-extrabold tracking-tight lg:text-2xl mb-6">
                        <span className="text-6xl text-[#d5b9b2] mr-2">
                            Create
                        </span>{" "}
                        An Account
                    </h1>
                    <p className="mb-4 text-sm font-bold text-gray-300">
                        create an account to get started
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            setUsername(e.target.value)
                                        }}
                                    />
                                    {isCheckingUsername && (
                                        <Loader2 className="animate-spin" />
                                    )}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p
                                            className={`text-sm ${
                                                usernameMessage ===
                                                "Username is valid and unique"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input {...field} name="email" />
                                    <p className="text-muted text-gray-400 text-sm">
                                        We will send you a verification code
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        {...field}
                                        name="password"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        don&apos;t have an account ?
                        <Link href="/auth/sign-in" className="text-[#d5b9b2]">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
