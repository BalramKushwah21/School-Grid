"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
	const handleLogout = async () => {
		// signOut automatically clears the NextAuth session
		// callbackUrl specifies where to send the user after logging out
		await signOut({ callbackUrl: "/auth/login" });
	};

	return (
		<button
			onClick={handleLogout}
			className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 active:scale-95"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={2}
				stroke="currentColor"
				className="w-4 h-4"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
				/>
			</svg>
			Log Out
		</button>
	);
}
