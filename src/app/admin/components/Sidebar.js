'use client'

import React, { useState } from "react";
import { GraduationCap, Settings, X } from "lucide-react";
import { menuConfig } from "./menuData";
import NavItem from "./NavItem";
import { prisma } from "@/lib/prisma";

export default function Sidebar({ isOpen, onClose }) {
	  const [activeTab, setActiveTab] = useState("daily");

	const getData = async () => {
		const data =  await prisma.schooldata.findUniue({
			where:{ 
				subdomain:subdomain,

			}
		})
	};


	const [openDropdown, setOpenDropdown] = useState(null);

	const handleToggle = (menuName) => {
		// अगर वही ड्रॉपडाउन दोबारा क्लिक हुआ तो बंद कर दो, नहीं तो नया खोल दो
		setOpenDropdown(openDropdown === menuName ? null : menuName);
	};

	return (
		<>
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col justify-between ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div>
					{/* स्कूल का नाम / लोगो */}
					<div className="h-16 flex items-center justify-between px-6 bg-slate-950 shrink-0">
						<div className="flex items-center gap-2">
							<GraduationCap className="text-indigo-400 w-8 h-8" />
							<span className="text-xl font-bold tracking-wider">
								SchoolGrid
							</span>
						</div>
						<button
							onClick={onClose}
							className="lg:hidden text-gray-400 hover:text-white"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					{/* स्क्रोल होने वाला मेनू कंटेनर */}
					<nav className="mt-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-11rem)] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
						{menuConfig.map((menu, index) => (
							<NavItem
							   onClick={() => setActiveTab(`{menu.title}`)}
								key={index}
								menu={menu}
								isOpen={openDropdown === menu.name}
								onToggle={() => handleToggle(menu.name)}
							/>
						))}
					</nav>
				</div>

				{/* सेटिंग्स (फिक्स्ड बॉटम) */}
				<div className="p-4 border-t border-slate-800 shrink-0">
					<a
						href="#"
						className="flex items-center gap-3 px-2 py-2 rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-colors"
					>
						<Settings className="w-5 h-5" />
						<span className="text-sm font-medium">
							System Settings
						</span>
					</a>
				</div>
			</aside>

			{/* मोबाइल स्क्रीन ओवरले */}
			{isOpen && (
				<div
					onClick={onClose}
					className="fixed inset-0 z-40 bg-black/40 lg:hidden"
				></div>
			)}
		</>
	);
}
