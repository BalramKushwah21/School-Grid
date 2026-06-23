// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "admin@school.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				// 1. Check if user exists in database
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user) {
					throw new Error("No user found with this email");
				}
				console.log(user.userRole);

				// 2. Verify Password
				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.password,
				);
				if (!passwordMatch) {
					throw new Error("Incorrect password");
				}

				// 3. Return user object (this gets passed to the JWT callback)
				return user;
			},
		}),
	],
	
	callbacks: {
		// JWT Callback: Yahan hum token ke andar user ka data daalte hain
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.userRole;
				token.schoolId = user.schoolId; // Embedding Tenant ID
			}
			return token;
		},
		// Session Callback: Yahan hum frontend (browser) ke liye data expose karte hain
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.schoolId = token.schoolId; // Making it accessible everywhere
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
