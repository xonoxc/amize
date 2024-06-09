import { ConnectToDatabase } from "@/db/dbConnection"
import User from "@/models/user"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    await ConnectToDatabase()
    try {
        const { email, password, username } = await request.json()

        console.log(email, password, username)

        const isExitingUserByUsername = await User.findOne({
            username,
        })

        if (isExitingUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "username is already taken",
                },
                { status: 400 }
            )
        }

        const existingUserByEmail = await User.findOne({ email })

        if (existingUserByEmail) {
            return Response.json({
                success: false,
                message: "User with that email already exists",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        console.log(hashedPassword)

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        })

        console.log(newUser)

        await newUser.save()

        return Response.json(
            {
                success: true,
                message:
                    "User created successfully , Please verify your account!",
            },
            { status: 201 }
        )
    } catch (error) {
        console.error(`Error registering user: ${error}`)
        return Response.json(
            {
                success: false,
                message: `Error Registering user : ${error}`,
            },
            { status: 500 }
        )
    }
}
