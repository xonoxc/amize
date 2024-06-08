"use client"
import axios, { AxiosError } from "axios"
import { User } from "next-auth"
import { Loader2, RefreshCcw } from "lucide-react"
import { MessageCard } from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useCallback, useEffect, useState } from "react"
import { Message } from "@/models/user"
import { useSession } from "next-auth/react"
import { ApiResponse } from "@/types/ApiResponse"
import { useForm } from "react-hook-form"
import { acceptMessageSchema } from "@/validation/acceptMessageSchema"

export default function DashBoard(): JSX.Element {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSwitchLoading, setIsSiwtchLoading] = useState<boolean>(false)

    const { toast } = useToast()

    const handleDeleteMessage = async (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    })

    const { register, watch, setValue } = form

    const acceptMessage = watch("acceptMessage")

    const fetchAcceptMessage = useCallback(async () => {
        setIsSiwtchLoading(true)
        try {
            const { data } = await axios.get<ApiResponse>(
                "/api/accept-messages"
            )
            setValue("acceptMessage", data.isAcceptingMessages)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "failed to fetch message settings",
                variant: "destructive",
            })
        } finally {
            setIsSiwtchLoading(false)
        }
    }, [setValue, toast])

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(false)
            setIsSiwtchLoading(false)
            try {
                const { data } = await axios.get("/api/get-message")

                setMessages(data.messages || [])

                if (refresh) {
                    toast({
                        title: "Refreshed messages",
                        description: "showing latest messages",
                    })
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                toast({
                    title: "Error",
                    description:
                        axiosError.response?.data.message ||
                        "failed to fetch messages",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
                setIsSiwtchLoading(false)
            }
        },
        [setIsLoading, setMessages, toast]
    )

    useEffect(() => {
        if (!session || !session.user) return

        fetchMessages()

        fetchAcceptMessage()
    }, [session, setValue, toast, acceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>(
                "/api/accept-messages",
                {
                    acceptMessage: !acceptMessage,
                }
            )
            setValue("acceptMessage", !acceptMessage)
            toast({
                title: response.data.message,
                variant: "default",
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "failed to fetch messages",
                variant: "destructive",
            })
        }
    }

    if (!session || !session.user) {
        return <div></div>
    }

    const { username } = session.user as User

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profile = `${baseUrl}/u/${username}`

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(profile)
        toast({
            title: "URL copied!",
            description: "Profile url has been copied to clipboard",
        })
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6  rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">
                    Copy Your Unique Link
                </h2>{" "}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profile}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipBoard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessage ? "On" : "Off"}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault()
                    fetchMessages(true)
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={index}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}
