import { Message } from "@/models/user"

export interface ApiResponse {
    success: boolean
    message: string
    isAcceptingMessage?: boolean
    recivedMessages?: Array<Message>
    data?: Object
}
