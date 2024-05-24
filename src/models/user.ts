import mongoose, { Schema, Document } from "mongoose"

export interface Message extends Document {
	createdAt: Date
	content: string
}

export interface User extends Document {
	username: string
	email: string
	password: string
	verificationCode: string
	isVerified: boolean
	verificationExpiry: Date
	isAcceptingMessages: boolean
	messages: Message[]
}

const messageSchema: Schema<Message> = new Schema(
	{
		content: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
	},
	{ timestamps: true }
)

const userSchema: Schema<User> = new Schema(
	{
		username: {
			type: String,
			required: [true, "name is required"],
			match: [
				/^[a-zA-Z0-9_]+$/,
				"Username should only contain letters, numbers and underscores",
			],
		},
		email: {
			type: String,
			required: [true, "email is required"],
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please fill a valid email address",
			],
		},
		password: {
			type: String,
			required: [true, "password is required"],
			match: [
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				"Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
			],
		},
		verificationCode: {
			type: String,
			required: [true, "verification code is required"],
		},
		verificationExpiry: {
			type: Date,
			required: [true, "verification expiry is required"],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isAcceptingMessages: {
			type: Boolean,
			default: true,
		},
		messages: [messageSchema],
	},
	{ timestamps: true }
)

const User =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", userSchema)

export default User
