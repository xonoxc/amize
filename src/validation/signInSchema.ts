import { z } from "zod"

export const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[a-z\d@$!%*?&#]{8,}$/i, {
            message:
                "Password should be at least 8 characters long and contain at least one number and one special character",
        }),
})
