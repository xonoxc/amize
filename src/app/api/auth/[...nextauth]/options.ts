import { ConnectToDatabase } from "@/db/dbConnection"
import User from "@/models/user"
import { NextAuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { envVariables } from "@/validation/env/validation.env"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await ConnectToDatabase()

                try {
                    const user = await User.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { password: credentials.password },
                        ],
                    })
                    console.log("User", user)
                    if (!user) {
                        throw new Error("No user found with this email")
                    }

                    if (!user.isVerified) {
                        throw new Error(
                            "Please verify your account before logging in"
                        )
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isPasswordCorrect) {
                        throw new Error("Incorrect Password")
                    }

                    return user
                } catch (err: any) {
                    throw new Error(err)
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            console.log("Token", token)
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }

            console.log("session", session)
            return session
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: envVariables.NEXT_AUTH_SECRET,
    pages: {
        signIn: "/auth/sign-in",
    },
}
