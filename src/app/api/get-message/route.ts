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
        const user = await userModel
            .aggregate([
                { $match: { _id: userID } },
                { $unwind: "$messages" },
                { $sort: { "messages.createdAt": -1 } },
                { $group: { _id: "$_id", messages: { $push: "$messages" } } },
            ])
            .exec()

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                data: user[0].messages,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("An unexpected error occurred", error)
        return Response.json(
            {
                message: "Internal Server Errror",
                success: false,
            },
            { status: 500 }
        )
    }
}
