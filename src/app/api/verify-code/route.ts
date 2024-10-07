import { ConnectToDatabase } from "@/db/dbConnection"
import User from "@/models/user"

export async function POST(request: Request) {
	await ConnectToDatabase()

	try {
		const { username, code } = await request.json()

		const user = await User.findOne({ username: username })

		if (!user) {
			return Response.json(
				{ success: false, message: "user not found!" },
				{ status: 404 }
			)
		}

		const isUserCodeValid = user.verificationCode == code
		const isCodeNotExpired = new Date(user.verificationExpiry) > new Date()

		if (isUserCodeValid && isCodeNotExpired) {
			user.isVerified = true

			await user.save()

			return Response.json(
				{
					success: true,
					message: "User verification Successfull!",
				},
				{ status: 200 }
			)
		} else if (!isCodeNotExpired) {
			return Response.json(
				{
					success: false,
					message: "Verification Code Expired!",
				},
				{ status: 400 }
			)
		} else {
			return Response.json(
				{
					success: false,
					message: "Verification Code Incorrect!",
				},
				{ status: 400 }
			)
		}
	} catch (error) {
		console.error(`Error while verifing user ${error}`)

		return Response.json(
			{
				success: false,
				message: "Verification Code Incorrect!",
			},
			{ status: 500 }
		)
	}
}
