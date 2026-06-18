"use client";
import { useSession } from "next-auth/react";

export default function CheckSchoolId() {
	const { data: session, status } = useSession();

	if (status === "loading") return <p>Loading...</p>;

	// Dhyan rahe: Hamesha Guard Clause check lagayein
	if (session && session.user && session.user.schoolId) {
		return (
			<p>
				Success! Aapki Cookie me School ID hai: {session.user.schoolId}
			</p>
		);
	}

	return <p>Error: Cookie me School ID nahi mila ya aap logged out hain.</p>;
}
