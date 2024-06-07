import { Message } from "@/models/user"

export interface ApiResponse {
    success: boolean
    message: string
    isAcceptingMessages?: boolean
    recivedMessages?: Array<Message>
    data?: Object
}
