import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(3, { message: "Username must be at least 3 characters long" })
	.max(20, { message: "Username must be at most 20 characters long" })
	.regex(/^[a-zA-Z0-9_]+$/, {
		message: "Username should only contain letters, numbers and underscores",
	});

export const signupSchema = z.object({
	username: usernameValidation,
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" })
		.regex(
			/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			{
				message:
					"Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
			}
		),
});
