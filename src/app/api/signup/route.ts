import { ConnectToDatabase } from "@/db/dbConnection"
import User from "@/models/user"
import bcrypt from "bcryptjs"
import { sendVericiationEmail } from "@/helpers/verication.email"

const generateSixDigitOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
    await ConnectToDatabase()
    try {
        const { email, password, username } = await request.json()

        console.log(email, username, password)

        const existingVerifiedUser = await User.findOne({
            username,
            isVerified: true,
        })

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "username is already taken",
                },
                { status: 400 }
            )
        }

        const existingUser = await User.findOne({ email })

        const otp = generateSixDigitOtp()

        console.log(otp)

        if (existingUser) {
            if (existingUser.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    { status: 400 }
                )
            } else {
                const hashPassword = await bcrypt.hash(password, 10)
                existingUser.password = hashPassword
                existingUser.verificationCode = otp
                existingUser.verificationExpiry = new Date(
                    Date.now() + 10 * 60 * 1000
                )

                await existingUser.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                verificationCode: otp,
                verificationExpiry: new Date(Date.now() + 10 * 60 * 1000),
                isVerified: false,
                messages: [],
            })

            await newUser.save()
        }

        const emailStatus = await sendVericiationEmail({
            username,
            verificationCode: otp,
            destination: email,
        })

        if (!emailStatus.success) {
            return Response.json(
                {
                    success: false,
                    message: emailStatus.message,
                },
                { status: 500 }
            )
        }

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
