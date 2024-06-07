import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { ConnectToDatabase } from "@/db/dbConnection"
import UserModel, { User } from "@/models/user"

export async function POST(req: Request) {
    await ConnectToDatabase()

    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if (!session || !user) {
        return Response.json(
            {
                message: "You must be logged in to use this feature",
                success: false,
            },
            { status: 401 }
        )
    }

    const userId = user._id
    const { acceptMessage } = await req.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages: acceptMessage,
            },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    message:
                        "Unable to find the user to update the acceptance status",
                    success: false,
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User updated successfully",
                isAcceptingMessages: updatedUser.isAcceptingMessages,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error updating user acceptance status", error)
        return Response.json(
            {
                success: false,
                message: "Error updating user acceptance status",
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    await ConnectToDatabase()

    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if (!session || !user) {
        return Response.json(
            {
                message: "You must be logged in to use this feature",
                success: false,
            },
            { status: 401 }
        )
    }

    try {
        const foundUser = await UserModel.findById(user._id)

        if (!foundUser) {
            return Response.json(
                {
                    message: " User not found",
                    success: false,
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error getting user acceptance status", error)
        return Response.json(
            {
                success: false,
                message: "Error getting user acceptance status",
            },
            { status: 500 }
        )
    }
}
