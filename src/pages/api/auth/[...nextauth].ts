import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt"
import NextAuth from "next-auth/next";
import { LoginGoogle, LoginUsers } from "@/services/auth/services";

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
                const users: any = await LoginUsers(email);
                if (users.status) {
                    const passwordMatch = await bcrypt.compare(password, users.user.password);
                    if (passwordMatch) {
                        console.log(users.user)
                        return users.user
                    }
                } else {
                    throw new Error(JSON.stringify({ status: false, message: "user not found" }));
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_OATH_CLIENTID || "",
            clientSecret: process.env.GOOGLE_OATH_SECRETID || "",
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
            if (account?.provider === "google") {
                const data = {
                    fullame: user.name,
                    email: user.email,
                    id: user.sub,
                    idp: "google",
                    role: user.role
                }
                await LoginGoogle(data, (data: any) => {
                    token.email = data.email
                    token.fullname = data.fullame
                    token.id = data.id
                    token.idp = data.idp
                    token.role = data.role
                })
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