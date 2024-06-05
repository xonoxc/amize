"use client"

import { z } from "zod"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
import { verifySchema } from "@/validation/verifySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

export default function VerificationPage() {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(
                `/api/verify-code`,
                {
                    username: params.username,
                    code: data.code,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )

            toast({
                title: "Success",
                description: response.data.message,
            })

            router.replace("/auth/sign-in")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

            toast({
                title: "verification failed!",
                description:
                    axiosError.response?.data.message ??
                    "An Error occured , please try again. ",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="w-full max-w-md p-8 space-y-8  rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4 text-sm flex flex-col items-center">
                        Enter the verification code sent to your email
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Verify
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
