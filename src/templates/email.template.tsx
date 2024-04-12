import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Text,
} from "@react-email/components"
import * as React from "react"

interface VerificationTemplatesProps {
    username: string
    verificationCode: string
}

export const VerificationEmailTemplate = ({
    username,
    verificationCode,
}: VerificationTemplatesProps) => (
    <Html>
        <Head />
        <Preview>Email Verification Code</Preview>
        <Body style={main}>
            <Container style={container}>
                <h1>Amize</h1>
                <Text style={paragraph}>Hi {username},</Text>
                <Text style={paragraph}>
                    Welcome to Amize, Here is your veification code
                </Text>
                <Text style={paragraph}>{verificationCode}</Text>
                <Text style={paragraph}>
                    Best,
                    <br />
                    The amize team
                </Text>
                <Hr style={hr} />
            </Container>
        </Body>
    </Html>
)

export default VerificationEmailTemplate

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
}

const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
}

const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
}
