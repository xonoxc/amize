import { ConnectToDatabase } from "@/db/dbConnection"
import UserModel from "@/models/user"
import { getServerSession } from "next-auth"
import { User } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

interface RouteParams {
    messageId: string
}

export async function DELETE({ params }: { params: RouteParams }) {
    const messageId = params.messageId

    await ConnectToDatabase()

    const session = await getServerSession(authOptions)
    const _user = session?.user as User

    if (!session || !_user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: _user._id },
            { $pull: { messages: { _id: messageId } } }
        )

        if (updateResult.modifiedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted",
                },
                { status: 404 }
            )
        }

        return Response.json(
            { success: true, message: "Message deleted" },
            { status: 200 }
        )
    } catch (error) {
        console.error("error deleting message", error)
        return Response.json(
            { success: false, message: "Error deleting message" },
            { status: 500 }
        )
    }
}
