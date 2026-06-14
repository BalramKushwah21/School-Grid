"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(email);
    console.log(password);

    // API Call Here
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
	let data;
	try {
		data = await res.json();
	} catch (err) {
		console.error("Invalid API Response");
		alert("Server Error. Check API logs.");
		return;
	}

    if (res.ok) {
      console.log("Login Success", data);
    } else {
      console.log("Login Failed", data.message);
    }
  };



  return (
		<div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white text-center">
					<h1 className="text-3xl font-bold">Welcome Back</h1>

					<p className="mt-2 text-blue-100">
						Sign in to access your School Management Dashboard
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-8 space-y-5">
					{/* Security Badge */}
					<div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
						<p className="text-green-700 font-medium">
							🔒 Secure Login
						</p>
					</div>

					<div>
						<label className="block mb-2 font-semibold text-slate-700">
							Email Address
						</label>

						<input
							type="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter Email"
							required
							className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
						/>
					</div>

					<div>
						<label className="block mb-2 font-semibold text-slate-700">
							Password
						</label>

						<input
							type="password"
							name="password"
							value={password}
							onChange={(e)=> setPassword(e.target.value)}
							placeholder="Enter Password"
							required
							className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
						/>
					</div>

					<div className="flex justify-between items-center text-sm">
						<label className="flex items-center gap-2">
							<input type="checkbox" />
							Remember Me
						</label>

						<Link
							href="/forgot-password"
							className="text-blue-600 hover:underline"
						>
							Forgot Password?
						</Link>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-700 text-white py-3 rounded-xl"
					>
						Sign In
					</button>

          <div className="text-center text-sm text-gray-600">

            Don't have an account?{" "}
            <Link
              href="/auth/school-registration"
              className="text-blue-700 font-semibold hover:underline"
            >
              Register School
            </Link>

          </div>

        </form>

				{/* Footer */}
				<div className="border-t p-4 text-center text-xs text-gray-500">
					© 2026 School ERP Platform. All Rights Reserved.
				</div>
			</div>
		</div>
  );
}