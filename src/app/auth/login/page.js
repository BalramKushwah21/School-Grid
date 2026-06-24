"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"; // Changed Mail to User

export default function LoginPage() {
	const router = useRouter();
	// Email ki jagah generic 'identifier' use kar rahe hain
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const result = await signIn("credentials", {
			redirect: false,
			identifier: identifier, // Payload mein identifier bhej rahe hain
			password: password,
		});

		if (result?.error) {
			setError("Invalid credentials. Please try again.");
			setLoading(false);
		} else {
			router.push("/admin/dashboard");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 p-4 relative overflow-hidden">
			{/* Vivid Background Elements to make the Glass effect pop */}
			<div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl"></div>
			<div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"></div>
			<div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-pink-400/20 rounded-full blur-3xl"></div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md bg-white/40 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/60 relative z-10"
			>
				{/* Branding & Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-extrabold text-indigo-700 mb-6 tracking-tight drop-shadow-sm">
						School Grid.
					</h1>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Welcome Back
					</h2>
					<p className="text-sm text-gray-600 font-medium">
						Please enter your details to sign in.
					</p>
				</div>

				{/* Error Message */}
				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex items-center p-4 mb-6 text-sm text-red-800 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl"
					>
						<AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
						<span>{error}</span>
					</motion.div>
				)}

				{/* Login Form */}
				<form onSubmit={handleLogin} className="space-y-5">
					{/* Identifier Input (Email or Phone) */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-1">
							Email or Phone Number
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<User className="h-5 w-5 text-indigo-500/70" />
							</div>
							<input
								type="text" // Changed to text to allow phone numbers
								required
								value={identifier}
								onChange={(e) => setIdentifier(e.target.value)}
								className="block w-full pl-11 pr-4 py-3 border border-white/50 rounded-xl bg-white/50 backdrop-blur-md focus:bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none text-gray-800 placeholder-gray-400"
								placeholder="admin@school.com or 9876543210"
							/>
						</div>
					</div>

					{/* Password Input */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-1">
							Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-indigo-500/70" />
							</div>
							<input
								type={showPassword ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="block w-full pl-11 pr-12 py-3 border border-white/50 rounded-xl bg-white/50 backdrop-blur-md focus:bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none text-gray-800 placeholder-gray-400"
								placeholder="••••••••"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					{/* Remember Me & Forgot Password */}
					<div className="flex items-center justify-between mt-2">
						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-white/50 bg-white/50 rounded cursor-pointer"
							/>
							<label
								htmlFor="remember-me"
								className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer"
							>
								Remember me
							</label>
						</div>
						<div className="text-sm">
							<a
								href="#"
								className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
							>
								Forgot password?
							</a>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={loading}
						className="w-full flex justify-center items-center py-3 px-4 mt-6 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
					>
						{loading ? (
							<>
								<Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
								Authenticating...
							</>
						) : (
							"Sign In"
						)}
					</button>
				</form>
			</motion.div>
		</div>
	);
}
