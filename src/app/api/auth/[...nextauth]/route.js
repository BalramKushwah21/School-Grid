import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
	// 1. Configure the Session Strategy to use JWT
	session: {
		strategy: "jwt",
	},

	// 2. Setup the Credentials Provider
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
				// A. Check if email and password are provided
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Please enter an email and password");
				}

				// B. Find the user in your Prisma Database
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user) {
					throw new Error("No user found with this email");
				}

				// C. Verify the password
				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.password,
				);

				if (!passwordMatch) {
					throw new Error("Incorrect password");
				}

				// D. Return the user object (This gets passed to the JWT callback)
				return {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.userRole,
					schoolId: user.schoolId, // Crucial for multi-tenancy!
				};
			},
		}),
	],

	// 3. Configure the Callbacks to inject our custom data
	callbacks: {
		// This runs when the JWT is created or updated
		async jwt({ token, user }) {
			if (user) {
				// Injecting the custom fields into the token
				token.id = user.id;
				token.role = user.role;
				token.schoolId = user.schoolId;
			}
			return token;
		},

		// This runs when the session is checked on the frontend or backend
		async session({ session, token }) {
			if (token) {
				// Passing the token data into the active session
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.schoolId = token.schoolId;
			}
			return session;
		},
	},

	// 4. Secret & Pages (Optional: Custom Login Page)
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/auth/school-login", // Redirect here if a user isn't authenticated
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

