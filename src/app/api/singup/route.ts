import { NextApiRequest, NextApiResponse } from "next"
import { ConnectToDatabase } from "@/db/dbConnection"
import User from "@/models/user"
import bcrypt from "bcryptjs"
import { ApiResponse } from "@/types/ApiResponse"
import { sendVericiationEmail } from "@/helpers/verication.email"

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

        if (!email || !password || !username) {
            return response.status(400).json({
                success: false,
                message: "Please fill in all fields",
            })
        }

        const user = await User.findOne({ email })

        if (user) {
            if (!user.isVerified) {
                const otp = generateSixDigitOtp()
                const hashedOtp = await bcrypt.hash(otp.toString(), 10)

                user.verificationCode = hashedOtp

                await user.save()

                const emailResponse = await sendVericiationEmail({
                    username,
                    verificationCode: otp,
                    destination: email,
                })

                if (emailResponse.success) {
                    return response.status(200).json({
                        success: true,
                        message: emailResponse.message,
                    })
                }

                return response.status(500).json({
                    success: false,
                    message: emailResponse.message,
                })
            }

            return response.status(400).json({
                success: false,
                message: "User already exists",
            })
        }
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Error while registering the user",
        })
    }
}
