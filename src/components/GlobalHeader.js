"use client";
import React, { useState, useEffect } from "react";
import { GraduationCap, X, ChevronDown, ChevronRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import {
	FiSearch,
	FiBell,
	FiChevronDown,
	FiUser,
	FiMenu,
	FiX,
} from "react-icons/fi";
import LogOut from "@/components/LogoutButton";
import { div, span } from "framer-motion/client";

const GlobalHeader = ({
	toggleSidebar,
	isSidebarOpen,
	schoolData,
	isLoading,
}) => {
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	// Default system state fallback
	const [userData, setUserData] = useState({
		name: "Loading...",
		role: "User Account",
		avatar: "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff",
	});

	// Universal state tracker: Auto-detects Admin or Teacher from NextAuth Session
	useEffect(() => {
		const fetchUserSession = async () => {
			try {
				const response = await fetch("/api/auth/session");
				const session = await response.json();

				if (session && session.user) {
					// Dynamic color matching based on role category
					const isTeacher = session.user.role === "TEACHER";
					const avatarBg = isTeacher ? "0D9488" : "0D8ABC"; // Teal for Teacher, Blue for Admin

					const dynamicAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
						session.user.name || "User",
					)}&background=${avatarBg}&color=fff`;

					setUserData({
						name: session.user.name || "School Member",
						role: session.user.role || "Member",
						avatar: dynamicAvatar,
					});
				}
			} catch (error) {
				console.error(
					"Failed to sync structural header identity:",
					error,
				);
			}
		};

		fetchUserSession();
	}, []);

	return (
		<header className="bg-white shadow-sm border-b border-gray-200 z-40 sticky top-0 w-full">
			<div className="flex items-center justify-between px-4 sm:px-6 py-4">
				{/* Left Block: Hamburger Button Extreme Left + Search Input Group */}
				<div className="flex items-center flex-1 gap-2 sm:gap-4">
					{/* School Data Display */}
					<div className="hidden lg:flex">
						{isLoading ? (
							<div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div> // Loading effect
						) : schoolData ? (
							<h1 className="text-xl font-bold text-blue-900 truncate max-w-xs">
								{schoolData.schoolName || "My School Dashboard"}
								{/* Note: 'schoolName' ko apne Prisma schema ke field name se replace karein */}
							</h1>
						) : (
							<h1 className="text-xl font-bold text-gray-800">
								Dashboard
							</h1>
						)}
					</div>
					<button
						onClick={toggleSidebar}
						className="text-gray-500 hover:text-blue-600 focus:outline-none lg:hidden transition-all duration-300 transform active:scale-95 p-1 rounded-lg hover:bg-gray-100 shrink-0"
						aria-label="Toggle Navigation Control Panel"
					>
						{isSidebarOpen ? (
							<div className="flex items-center gap-3">
								<GraduationCap className="text-[#3b82f6] w-8 h-8" />

								<span className="text-[24px] font-extrabold tracking-wide text-black">
									{isLoading? (
										<div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div> // Loading effect
									) : schoolData? (
										<h1 className="text-xl font-bold text-blue-900 truncate max-w-xs">
											{schoolData.schoolName ||
												"My School Dashboard"}
											{/* Note: 'schoolName' ko apne Prisma schema ke field name se replace karein */}
										</h1>
									) : (
										<h1 className="text-xl font-bold text-gray-800">
											Dashboard
										</h1>
									)}
								</span>
							</div>
						) : (
							<FiMenu className="text-2xl animate-in fade-in duration-200" />
						)}
					</button>

					{/* Middle: Yahan aayega aapka Dynamic Search Bar */}
					<div className="flex-1 px-4 flex justify-center sm:justify-end md:justify-center">
						<SearchBar />
					</div>
				</div>

				{/* Right Block: Badges, Notification Centers & Profile Drops */}
				<div className="flex items-center space-x-3 sm:space-x-6 shrink-0">
					{/* Global Academic Calendar Badge */}
					<div className="hidden md:block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
						Academic Year 2026-2027
					</div>

					{/* Notification Alert Engine */}
					<button className="relative text-gray-500 hover:text-blue-600 transition-colors focus:outline-none p-1 rounded-full hover:bg-gray-50">
						<FiBell className="text-2xl" />
						<span className="absolute top-1 right-1 flex h-4 w-4">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white justify-center items-center font-black">
								3
							</span>
						</span>
					</button>

					{/* Comprehensive Account Meta Shell */}
					<div className="relative">
						<button
							onClick={() => setIsProfileOpen(!isProfileOpen)}
							className="flex items-center space-x-2 sm:space-x-3 focus:outline-none hover:bg-gray-50 p-1 rounded-xl transition-colors"
						>
							<img
								src={userData.avatar}
								alt="User Portal Profile Avatar"
								className="w-9 h-9 rounded-full border-2 border-indigo-500/80 object-cover shadow-xs"
							/>
							<div className="hidden md:block text-left">
								<p className="text-sm font-bold text-gray-800 leading-tight">
									{userData.name}
								</p>
								<p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mt-0.5">
									{userData.role.replace("_", " ")}
								</p>
							</div>
							<FiChevronDown className="text-gray-400 hidden md:block w-4 h-4" />
						</button>

						{/* Interactive Dropdown Interface */}
						{isProfileOpen && (
							<div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
								<a
									href={
										userData.role === "TEACHER"
											? "/teachers/profile"
											: "/admin/profile"
									}
									className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-semibold"
								>
									<FiUser className="mr-3 text-base" /> My
									Account file
								</a>
								<div className="border-t border-gray-100 my-1"></div>
								<div className="px-2 pt-1">
									<LogOut />
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default GlobalHeader;
