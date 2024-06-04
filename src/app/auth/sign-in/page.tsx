"use client"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { signInSchema } from "@/validation/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"

export default function LoginForm() {
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.email,
            password: data.password,
        })

        if (result?.error) {
            if (result.error === "CredentialsSignin") {
                toast({
                    title: "Login Failed!",
                    description: "Incorrect username or password",
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Login Failed!",
                    description: result.error,
                    variant: "destructive",
                })
            }
        }

        if (result?.url) {
            router.replace("/admin/dashboard")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="w-full max-w-md p-8 space-y-8  ">
                <div className="text-center">
                    <h1 className="text-xl font-extrabold tracking-tight lg:text-xl  mb-6">
                        <span className="text-6xl text-orange-300 mr-2">
                            Welcome
                        </span>{" "}
                        Back !
                    </h1>
                    <p className="mb-4 text-sm text-gray-300">
                        Sign in to continue your secret conversations
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input type="email" {...field} />
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
                                    <Input type="password" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit">
                            Sign In
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not a member yet?{" "}
                        <Link href="/auth/sign-up" className="text-orange-300 ">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
