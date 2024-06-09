import { z } from "zod"
import User from "@/models/user"
import { ConnectToDatabase } from "@/db/dbConnection"
import { usernameValidation } from "@/validation/singupSchema"

const usernameValidationQuery = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {
    await ConnectToDatabase()
    try {
        const { searchParams } = new URL(request.url as string)

        const queryParams = {
            username: searchParams.get("username"),
        }

        const result = usernameValidationQuery.safeParse(queryParams)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(",")
                            : `Invalid query params`,
                },
                { status: 400 }
            )
        }

        const { username } = result.data

        const existingVerifiedUser = await User.findOne({
            username,
        })

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is valid and unique",
            },
            { status: 200 }
        )
    } catch (error) {
        console.error(`Error checking username availabilitiy : ${error}`)
        return Response.json(
            {
                success: false,
                message: `Error checking username availabilitiy : ${error}`,
            },
            { status: 500 }
        )
    }
}
