// src/components/SearchBar.jsx
"use client";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi"; // react-icons install hona chahiye (npm i react-icons)

export default function SearchBar() {
	const [searchQuery, setSearchQuery] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);

	// Dummy Data (Aage chalkar yeh API/Database se aayega)
	const studentsList = [
		{ id: 1, name: "Aarav Sharma", rollNo: "101", class: "10th" },
		{ id: 2, name: "Vihaan Singh", rollNo: "102", class: "10th" },
		{ id: 3, name: "Ananya Gupta", rollNo: "103", class: "9th" },
	];

	// Filtering Logic
	const filteredStudents = studentsList.filter(
		(student) =>
			student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			student.rollNo.includes(searchQuery),
	);

	const handleInputChange = (e) => {
		setSearchQuery(e.target.value);
		if (e.target.value.length > 0) {
			setShowDropdown(true); // Type karte hi dropdown open hoga
		} else {
			setShowDropdown(false); // Khali hone par band ho jayega
		}
	};

	return (
		<div className="relative w-full max-w-md">
			{/* Search Input Box */}
			<div className="relative flex items-center w-full h-10 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-gray-200">
				<div className="grid place-items-center h-full w-12 text-gray-300">
					<FiSearch size={18} />
				</div>
				<input
					className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
					type="text"
					id="search"
					placeholder="Search students, roll no..."
					value={searchQuery}
					onChange={handleInputChange}
					onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Bahar click karne par dropdown band kare
					onFocus={() =>
						searchQuery.length > 0 && setShowDropdown(true)
					}
				/>
			</div>

			{/* Floating Dropdown for Results */}
			{showDropdown && (
				<div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
					{filteredStudents.length > 0 ? (
						<ul className="py-2">
							{filteredStudents.map((student) => (
								<li
									key={student.id}
									className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
								>
									<div className="text-sm font-semibold text-gray-800">
										{student.name}
									</div>
									<div className="text-xs text-gray-500">
										Roll: {student.rollNo} | Class:{" "}
										{student.class}
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="p-4 text-sm text-gray-500 text-center">
							No results found
						</div>
					)}
				</div>
			)}
		</div>
	);
}
