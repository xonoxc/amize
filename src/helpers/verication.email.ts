import VerificationEmailTemplate from "@/templates/email.template"
import { ApiResponse } from "@/types/ApiResponse"
import { envVariables } from "@/validation/env/validation.env"
import { Resend } from "resend"

interface EmailVerificationProps {
    username: string
    verificationCode: string
    destination: string
}

export async function sendVericiationEmail({
    username,
    verificationCode,
    destination,
}: EmailVerificationProps): Promise<ApiResponse> {
    const resend = new Resend(envVariables.RESEND_API_KEY)

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: destination,
            subject: "Verify your email | Amize",
            react: VerificationEmailTemplate({ username, verificationCode }),
        })

        return {
            success: true,
            message: "Email sent successfully",
        }
    } catch (error) {
        console.error(`Error ocurred while sending email : ${error}`)
        return {
            success: false,
            message: `Error ocurred while sending email : ${error}`,
        }
    }
}
