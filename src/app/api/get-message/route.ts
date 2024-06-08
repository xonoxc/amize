import { ConnectToDatabase } from "@/db/dbConnection"
import userModel from "@/models/user"
import mongoose from "mongoose"
import { User } from "next-auth"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function GET() {
    await ConnectToDatabase()

    const session = await getServerSession(authOptions)
    const _user = session?.user as User

    if (!session || !_user) {
        return Response.json(
            {
                success: false,
                message: "You must be logged in to use this feature",
            },
            { status: 401 }
        )
    }

    const userID = new mongoose.Types.ObjectId(_user._id)
    try {
        const userMessages = await userModel.aggregate([
            { $match: { _id: userID } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } },
        ])

        if (!userMessages) {
            return Response.json(
                {
                    success: true,
                    messages: "user not found",
                },
                { status: 404 }
            )
        }

        if (userMessages.length === 0) {
            return Response.json(
                {
                    success: true,
                    messages: userMessages,
                },
                { status: 200 }
            )
        }

        return Response.json(
            {
                success: true,
                messages: userMessages[0].messages,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("An unexpected error occurred", error.message)
        return Response.json(
            {
                message: "Internal Server Errror",
                success: false,
            },
            { status: 500 }
        )
    }
}
