import mongoose from "mongoose"

interface Connection {
    isConnected?: number
}

const connection: Connection = {}

export async function ConnectToDatabase() {
    if (connection.isConnected) {
        console.log("Database connection already exsists!")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI!)

        connection.isConnected = db.connections[0].readyState
    } catch (error) {
        console.error(
            `Error occured wile connecting to the database : ${error}`
        )

        process.exit(1)
    }
}
