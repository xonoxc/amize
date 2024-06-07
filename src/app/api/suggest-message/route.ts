import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { envVariables } from "@/validation/env/validation.env"
import { streamText } from "ai"

export const runtime = "edge"

const google = createGoogleGenerativeAI({
    apiKey: envVariables.GEMINI_API_KEY,
})

const model = google("models/gemini-1.5-flash-latest", {
    topK: 400,
})

export async function POST() {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

        const result = await streamText({ model, prompt })

        return result.toAIStreamResponse()
    } catch (error) {
        return Response.json(
            {
                message: "Error generating suggestions",
                success: false,
                error,
            },
            { status: 500 }
        )
    }
}
