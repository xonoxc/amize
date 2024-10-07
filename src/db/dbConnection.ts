import mongoose from "mongoose"
import { envVariables } from "@/validation/env/validation.env"

interface Connection {
	isConnected?: number
}

const connection: Connection = {}

export async function ConnectToDatabase(): Promise<void> {
	if (connection.isConnected) {
		console.log("Database connection already exsists!")
		return
	}

	try {
		const db = await mongoose.connect(`${envVariables.MONGODB_URI}/amize`)

		connection.isConnected = db.connections[0].readyState

		console.log(
			"Database connection successfull! Host:",
			db.connection.host
		)
	} catch (error) {
		console.error(
			`Error occured wile connecting to the database : ${error}`
		)

		process.exit(1)
	}
}
