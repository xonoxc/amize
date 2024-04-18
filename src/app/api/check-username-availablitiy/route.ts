import { z } from "zod"
import User from "@/models/user"
import { ConnectToDatabase } from "@/db/dbConnection"
import { usernameValidation } from "@/validation/singupSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { NextApiRequest, NextApiResponse } from "next"

const usernameValidationQuery = z.object({
    username: usernameValidation,
})

export async function GET(
    request: NextApiRequest,
    response: NextApiResponse<ApiResponse>
) {
    await ConnectToDatabase()
    try {
        const { searchParams } = new URL(request.url as string)

        const queryParams = {
            username: searchParams.get("username"),
        }

        const result = usernameValidationQuery.safeParse(queryParams)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return response.status(400).json({
                success: false,
                message:
                    usernameErrors?.length > 0
                        ? usernameErrors.join(",")
                        : `Invalid query params`,
            })
        }

        const { username } = result.data

        const existingVerifiedUser = await User.findOne({
            username,
            isVerified: true,
        })

        if (existingVerifiedUser) {
            return response.status(200).json({
                success: false,
                message: "Username is already taken",
            })
        }

        return response.status(200).json({
            success: true,
            message: "Username is valid and unique",
        })
    } catch (error) {
        console.error(`Error checking username availabilitiy : ${error}`)
        return response.status(500).json({
            success: false,
            message: `Error checking username availabilitiy : ${error}`,
        })
    }
}
