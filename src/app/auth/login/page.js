// src/app/login/page.js
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// NextAuth ka signIn function call kar rahe hain
		const result = await signIn("credentials", {
			redirect: false,
			email: email,
			password: password,
		});

		if (result?.error) {
			setError("Invalid email or password. Please try again.");
			setLoading(false);
		} else {
			// Login success hone par dashboard par bhej dein
			router.push("/admin/dashboard");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center text-gray-800">
					Login to School Grid
				</h2>

				{error && (
					<div className="p-3 text-sm text-red-600 bg-red-100 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							placeholder="admin@school.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
}
