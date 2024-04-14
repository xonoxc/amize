import { NextApiRequest, NextApiResponse } from "next"
import { ConnectToDatabase } from "@/db/dbConnection"
import User from "@/models/user"
import bcrypt from "bcryptjs"
import { ApiResponse } from "@/types/ApiResponse"
import { sendVericiationEmail } from "@/helpers/verication.email"
import { singupSchema } from "@/validation/singupSchema"

const generateSixDigitOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export default async function POST(
    request: NextApiRequest,
    response: NextApiResponse<ApiResponse>
) {
    await ConnectToDatabase()
    try {
        const { email, password, username } = await request.body()

        const validationResult = singupSchema.safeParse({
            email,
            password,
            username,
        })

        if (!validationResult.success) {
            return response.status(400).json({
                success: false,
                message: validationResult.error?.message,
            })
        }

        const existingVerifiedUser = await User.findOne({
            username,
            isVerified: true,
        })

        if (existingVerifiedUser) {
            return response.status(400).json({
                success: false,
                message: "username is already taken",
            })
        }

        const existingUser = await User.findOne({ email })

        const otp = generateSixDigitOtp()

        if (existingUser) {
            if (existingUser.isVerified) {
                return response.status(400).json({
                    success: false,
                    message: "User already exists with this email",
                })
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
            return response.status(500).json({
                success: false,
                message: emailStatus.message,
            })
        }

        return response.status(201).json({
            success: true,
            message: "User created successfully , Please verify your account!",
        })
    } catch (error) {
        console.error(`Error registering user: ${error}`)
        return response.status(500).json({
            success: false,
            message: `Error Registering user : ${error}`,
        })
    }
}
