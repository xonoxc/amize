import { ConnectToDatabase } from "@/db/dbConnection"
import User from "@/models/user"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { envVariables } from "@/validation/env/validation.env"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentails",
            name: "credentials",

            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },

            async authorize(credentials): Promise<any> {
                await ConnectToDatabase()

                try {
                    const user = await User.findOne({
                        $or: [],
                    })

                    if (!user) {
                        throw new Error("User not found with the given email")
                    }

                    if (!user.isVerified) {
                        throw new Error(
                            "Please verify  your email before trying to login "
                        )
                    }

                    const isPasswordCorret = await bcrypt.compare(
                        credentials?.password as string,
                        user.password
                    )

                    if (!isPasswordCorret) {
                        throw new Error(
                            "Incorrect password , try again with a correct password"
                        )
                    }

                    return user
                } catch (error: any) {
                    throw new Error(error)
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

            return token
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
    },

    session: {
        strategy: "jwt",
    },
    secret: envVariables.NEXT_AUTH_SECRET,
    pages: {
        signIn: "sign-in",
    },
}
