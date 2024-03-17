import { LoginUsers } from "@/lib/firebase/services";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import NextAuth from "next-auth/next";

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            type: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };
                const users: any = await LoginUsers({ email, password });
                if (users.status) {
                    const passwordMatch = await bcrypt.compare(password, users.user.password);
                    if (passwordMatch) {
                        return users.user
                    }
                } else if (users.statusCode === 401) {
                    if (users.message === "Invalid password") {
                        return null
                    }
                } else {
                    if (users.message === "User not found") {
                        return null
                    }
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, user, profile }: any) {
            if (account?.provider === "credentials") {
                token.email = user.email;
                token.fullname = user.fullname;
                token.phoneNumber = user.phoneNumber
                token.id = user.id;
                token.idp = "credentials";
                token.role = user.role
            }
            return token;
        },
        async session({ session, token }: any) {
            if ("email" in token) {
                session.user.email = token.email;
            }
            if ("fullname" in token) {
                session.user.name = token.fullname;
            }
            if ("id" in token) {
                session.user.id = token.id;
            }
            if ("idp" in token) {
                session.user.idp = token.idp;
            }
            if ("role" in token) {
                session.user.role = token.role;
            }
            if ("phoneNumber" in token) {
                session.user.phoneNumber = token.phoneNumber;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
}
export default NextAuth(authOptions)