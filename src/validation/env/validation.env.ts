import { z } from "zod"

export const envSchema = z.object({
    RESEND_API_KEY: z.string(),
    MONGODB_URI: z.string(),
    APP_HOST_URL: z.string(),
})

const env = envSchema.safeParse(process.env)

if (!env.success) {
    console.error("error validating env variables", env.error)
    process.exit(1)
}

export const envVariables = env.data
