import { z } from "zod"

export const envSchema = z.object({
    RESEND_API_KEY: z.string(),
    MONGODB_URI: z.string(),
    GEMINI_API_KEY: z.string(),
    NEXT_AUTH_SECRET: z.string(),
})

const env = envSchema.safeParse(process.env)

if (!env.success) {
    console.error("error validating env variables", env.error)
    process.exit(1)
}

export const envVariables = env.data
