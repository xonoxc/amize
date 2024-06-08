"use client"

import { z } from "zod"
import { useState } from "react"
import { useParams } from "next/navigation"
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from "axios"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { messageSchema } from "@/validation/messageSchema"
import { useCompletion } from "ai/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ApiResponse } from "@/types/ApiResponse"
import { useToast } from "@/components/ui/use-toast"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

const specialChar = "||"

const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?"

const parseStringMessages = (messageString: string): string[] => {
    return messageString.replace(/^"|"$/g, "").split(specialChar)
}

export default function SendMessage() {
    const { toast } = useToast()
    const params = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const username = params.username

    const {
        complete,
        completion,
        error,
        isLoading: isSuggestingMessages,
    } = useCompletion({
        api: "/api/suggest-message",
        initialCompletion: initialMessageString,
    })

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    })

    const messageContent = form.watch("content")

    const handleMessageClick = (message: string) => {
        form.setValue("content", message)
    }

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true)
        try {
            const response = await axios.post<ApiResponse>(
                "/api/send-message",
                {
                    ...data,
                    username,
                }
            )

            toast({
                title: response.data.message,
                variant: "default",
            })

            form.reset({ ...form.getValues(), content: "" })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "Failed to send message",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchMessageSuggestions = async () => {
        try {
            complete("")
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }

    return (
        <div className="container mx-auto my-8 p-6 rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Link Profile
            </h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Send Anonymous Message to @{username}
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isLoading || !messageContent}
                            >
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <div className="space-y-4 my-8">
                <div className="space-y-2">
                    <Button
                        onClick={fetchMessageSuggestions}
                        className="my-4"
                        disabled={isSuggestingMessages}
                    >
                        Suggest Messages
                    </Button>
                    <p>Click on any message below to select it.</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <h3 className="text-xl font-semibold">Messages</h3>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    {error ? (
                        <p className="text-red-500">{error?.message}</p>
                    ) : (
                        parseStringMessages(completion).map(
                            (message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="mb-2 dark:bg-white bg-black dark:text-black text-white"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            )
                        )
                    )}
                </CardContent>
            </Card>
            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={"/auth/sign-up"}>
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </div>
    )
}
