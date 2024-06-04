import { ConnectToDatabase } from "@/db/dbConnection"
import UserModel, { Message } from "@/models/user"

export async function POST(request: Request) {
    await ConnectToDatabase()

    const { username, content } = await request.json()

    try {
        const user = await UserModel.findOne({ username }).exec()

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }

        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "user is not accepting messages",
                },
                { status: 403 }
            )
        }

        const newMessage = { content, createdAt: new Date() } as Message

        user.messages.push(newMessage)

        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error adding message", error)
        return Response.json(
            { success: false, message: "Error sendimg message" },
            { status: 500 }
        )
    }
}
