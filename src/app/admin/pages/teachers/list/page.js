"use client";
import React, { useEffect, useState } from "react";

const DEPARTMENTS = [
	"All Departments",
	"Science",
	"Mathematics",
	"Languages",
	"Social Studies",
	"Arts & PE",
];

export default function FacultyDirectory() {
	// --- CORE STATES ---
	const [currentDate, setCurrentDate] = useState("");
	const [teachers, setTeachers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// --- FILTER STATES ---
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDept, setSelectedDept] = useState("All Departments");

	// --- MODAL & FORM STATES (Like Student Page) ---
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTeacher, setSelectedTeacher] = useState(null);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [activeTab, setActiveTab] = useState("personalInfo");
	const [formData, setFormData] = useState({});

	// Notification State
	const [notification, setNotification] = useState({
		show: false,
		message: "",
		type: "success",
	});

	// Handle Client-Side Date
	useEffect(() => {
		setCurrentDate(
			new Date().toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}),
		);
	}, []);

	// Custom Notification Trigger
	const triggerNotification = (message, type = "success") => {
		setNotification({ show: true, message, type });
		setTimeout(() => {
			setNotification({ show: false, message: "", type: "success" });
		}, 4000);
	};

	// ================= BACKEND API FETCH =================
	const fetchTeachers = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/school/admin/teachers/get");
			if (!response.ok)
				throw new Error("Failed to fetch faculty records.");
			const result = await response.json();
			// Setting random avatar color if not provided by backend
			const dataWithColors = (result.data || []).map((t) => ({
				...t,
				avatarColor:
					t.avatarColor ||
					[
						"bg-indigo-600",
						"bg-emerald-600",
						"bg-rose-600",
						"bg-amber-600",
						"bg-teal-600",
					][Math.floor(Math.random() * 5)],
			}));
			setTeachers(dataWithColors);
		} catch (err) {
			setError(err.message);
			triggerNotification(err.message, "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTeachers();
	}, []);

	// ================= LOAD TEACHER FULL DETAILS =================
	const handleViewClick = async (teacherId) => {
		setIsModalOpen(true);
		setLoadingDetails(true);
		setIsEditing(false);
		setActiveTab("personalInfo");

		try {
			const response = await fetch(
				`/api/school/admin/teachers/${teacherId}`,
			);
			if (!response.ok) throw new Error("Failed to get faculty dossier.");
			const result = await response.json();
			const tch = result.data;
			setSelectedTeacher(tch);

			// Form mapping based on Teacher schema
			setFormData({
				employeeId: tch.employeeId || "",
				fullName: tch.fullName || "",
				gender: tch.gender || "",
				dob: tch.dob
					? new Date(tch.dob).toISOString().split("T")[0]
					: "",
				bloodGroup: tch.bloodGroup || "",

				email: tch.email || "",
				phone: tch.phone || "",
				emergencyContact: tch.emergencyContact || "",
				address: tch.address || "",

				department: tch.department || "Science",
				designation: tch.designation || "",
				joiningDate: tch.joiningDate
					? new Date(tch.joiningDate).toISOString().split("T")[0]
					: "",
				classesTaught: tch.classesTaught || "",
				qualifications: tch.qualifications || "",
				status: tch.status || "Active",

				basicSalary: tch.payroll?.basicSalary || "",
				bankName: tch.payroll?.bankName || "",
				accountNumber: tch.payroll?.accountNumber || "",
				ifscCode: tch.payroll?.ifscCode || "",
			});
		} catch (err) {
			triggerNotification(err.message, "error");
			setIsModalOpen(false);
		} finally {
			setLoadingDetails(false);
		}
	};

	// ================= SAVE EDITED DATA =================
	const handleSave = async () => {
		try {
			setIsSaving(true);
			const response = await fetch(
				`/api/school/admin/teachers/${selectedTeacher.id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				},
			);
			if (!response.ok) throw new Error("Update transaction failed.");

			triggerNotification(
				"Faculty details updated successfully!",
				"success",
			);
			setIsEditing(false);
			fetchTeachers(); // Refresh list
			handleViewClick(selectedTeacher.id); // Refresh modal data
		} catch (err) {
			triggerNotification(err.message, "error");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setTimeout(() => setSelectedTeacher(null), 300);
	};

	const handleChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	// Toggle Active/Leave Status directly from list
	const toggleStatus = async (id, currentStatus) => {
		const nextStatus = currentStatus === "Active" ? "On Leave" : "Active";
		try {
			const res = await fetch(`/api/school/admin/teachers/${id}/status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: nextStatus }),
			});
			if (!res.ok) throw new Error("Failed to update status");

			setTeachers((prev) =>
				prev.map((t) =>
					t.id === id ? { ...t, status: nextStatus } : t,
				),
			);
			triggerNotification(`Status updated to: ${nextStatus}`, "info");
		} catch (err) {
			triggerNotification(err.message, "error");
		}
	};

	// ================= FILTERS =================
	const filteredTeachers = teachers.filter((teacher) => {
		const matchesSearch =
			teacher.fullName
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			teacher.designation
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			teacher.employeeId
				?.toLowerCase()
				.includes(searchTerm.toLowerCase());

		const matchesDept =
			selectedDept === "All Departments" ||
			teacher.department === selectedDept;

		return matchesSearch && matchesDept;
	});

	const handleExportDirectory = () => {
		window.print();
	};

	return (
		<div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
			{/* Toast Notification */}
			{notification.show && (
				<div
					className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}
				>
					<span className="text-lg">
						{notification.type === "success" ? "🚀" : "⚠️"}
					</span>
					<p className="text-sm font-semibold">
						{notification.message}
					</p>
				</div>
			)}

			{/* HEADER */}
			<header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<div>
						<h1 className="text-3xl font-black text-slate-900 tracking-tight">
							Faculty Directory & Management
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							Manage educators, update profiles, and track payroll
							details.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<button
							onClick={handleExportDirectory}
							className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 rounded-lg text-sm transition flex items-center gap-2 shadow-sm"
						>
							Export Directory (PDF)
						</button>
					</div>
				</div>
			</header>

			{/* SEARCH & FILTERS */}
			<section className="max-w-7xl mx-auto px-4 md:px-8 mt-8 print:hidden">
				<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
					<div className="relative w-full md:w-96">
						<input
							type="text"
							placeholder="Search by name, ID or designation..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-4 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
						/>
					</div>
					<div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
						{DEPARTMENTS.map((dept) => (
							<button
								key={dept}
								onClick={() => setSelectedDept(dept)}
								className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${selectedDept === dept ? "bg-slate-900 text-white shadow" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
							>
								{dept}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* TEACHERS GRID */}
			<section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
				{loading ? (
					<div className="flex justify-center p-12 text-slate-500 animate-pulse font-bold">
						Syncing Faculty Database...
					</div>
				) : filteredTeachers.length === 0 ? (
					<div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
						<span className="text-5xl">🔍</span>
						<h3 className="text-lg font-bold text-slate-700 mt-4">
							No Educators Found
						</h3>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredTeachers.map((teacher) => (
							<div
								key={teacher.id}
								className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
							>
								<div>
									<div className="flex items-center gap-4 mb-4">
										<div
											className={`w-14 h-14 rounded-full ${teacher.avatarColor} flex items-center justify-center text-white font-extrabold text-lg shadow-sm`}
										>
											{teacher.fullName
												?.split(" ")
												.map((n) => n[0])
												.slice(0, 2)
												.join("") || "TR"}
										</div>
										<div>
											<h3 className="font-extrabold text-slate-950 text-base leading-tight">
												{teacher.fullName}
											</h3>
											<p className="text-xs text-slate-400 font-bold mt-0.5 uppercase">
												{teacher.employeeId}
											</p>
										</div>
									</div>

									<div className="space-y-2.5 text-xs">
										<div className="flex justify-between border-b border-slate-100 pb-1.5">
											<span className="font-semibold text-slate-400">
												Designation
											</span>
											<span className="font-bold text-slate-900 text-right">
												{teacher.designation}
											</span>
										</div>
										<div className="flex justify-between border-b border-slate-100 pb-1.5">
											<span className="font-semibold text-slate-400">
												Department
											</span>
											<span className="font-semibold text-indigo-700">
												{teacher.department}
											</span>
										</div>
										<div className="flex justify-between border-b border-slate-100 pb-1.5">
											<span className="font-semibold text-slate-400">
												Phone
											</span>
											<span className="font-medium text-slate-600 font-mono">
												{teacher.phone}
											</span>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
									<button
										onClick={() =>
											toggleStatus(
												teacher.id,
												teacher.status,
											)
										}
										className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1 rounded"
									>
										<span
											className={`w-2.5 h-2.5 rounded-full ${teacher.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`}
										></span>
										<span className="text-xs font-bold text-slate-700">
											{teacher.status}
										</span>
									</button>

									<button
										onClick={() =>
											handleViewClick(teacher.id)
										}
										className="text-xs font-bold text-indigo-600 hover:text-white border border-indigo-100 bg-indigo-50 hover:bg-indigo-600 rounded-lg px-4 py-2 transition-all"
									>
										View & Edit
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			{/* ================= COMPREHENSIVE TABS MODAL ================= */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
						{/* Header */}
						<div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
							<div>
								<h3 className="font-bold text-xl text-slate-800">
									{isEditing
										? "🖊️ Edit Faculty Profile"
										: "👁️ Faculty Master Record"}
								</h3>
								<p className="text-xs text-slate-400 mt-0.5">
									Emp ID:{" "}
									<span className="font-mono text-slate-700">
										{formData.employeeId}
									</span>
								</p>
							</div>
							<button
								onClick={handleCloseModal}
								className="text-slate-400 hover:text-red-500 bg-white border p-1.5 rounded-full"
							>
								✕
							</button>
						</div>

						{/* Tabs */}
						<div className="flex border-b border-slate-100 bg-slate-50/50 px-5 gap-2 overflow-x-auto text-xs font-bold uppercase text-slate-500">
							{[
								{ id: "personalInfo", label: "Personal Info" },
								{ id: "contact", label: "Contact & Address" },
								{ id: "academic", label: "Academic Details" },
								{ id: "payroll", label: "Payroll & Bank" },
							].map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`py-3.5 px-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-indigo-600 text-indigo-600" : "border-transparent hover:text-slate-700"}`}
								>
									{tab.label}
								</button>
							))}
						</div>

						{/* Content */}
						<div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
							{loadingDetails ? (
								<div className="flex justify-center items-center h-40">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
									{/* TAB 1: Personal Info */}
									{activeTab === "personalInfo" && (
										<>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Full Name
												</label>
												{isEditing ? (
													<input
														name="fullName"
														value={
															formData.fullName
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.fullName ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Gender
												</label>
												{isEditing ? (
													<select
														name="gender"
														value={formData.gender}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														<option value="MALE">
															Male
														</option>
														<option value="FEMALE">
															Female
														</option>
														<option value="OTHER">
															Other
														</option>
													</select>
												) : (
													<p className="text-sm font-semibold">
														{formData.gender ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Date of Birth
												</label>
												{isEditing ? (
													<input
														type="date"
														name="dob"
														value={formData.dob}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.dob || "N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Blood Group
												</label>
												{isEditing ? (
													<input
														name="bloodGroup"
														value={
															formData.bloodGroup
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.bloodGroup ||
															"N/A"}
													</p>
												)}
											</div>
										</>
									)}

									{/* TAB 2: Contact */}
									{activeTab === "contact" && (
										<>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Email Address
												</label>
												{isEditing ? (
													<input
														type="email"
														name="email"
														value={formData.email}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.email ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Phone Number
												</label>
												{isEditing ? (
													<input
														name="phone"
														value={formData.phone}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.phone ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Emergency Contact
												</label>
												{isEditing ? (
													<input
														name="emergencyContact"
														value={
															formData.emergencyContact
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.emergencyContact ||
															"N/A"}
													</p>
												)}
											</div>
											<div className="sm:col-span-3">
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Residential Address
												</label>
												{isEditing ? (
													<textarea
														name="address"
														value={formData.address}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm h-20"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.address ||
															"N/A"}
													</p>
												)}
											</div>
										</>
									)}

									{/* TAB 3: Academic */}
									{activeTab === "academic" && (
										<>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Department
												</label>
												{isEditing ? (
													<select
														name="department"
														value={
															formData.department
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														{DEPARTMENTS.slice(
															1,
														).map((d) => (
															<option
																key={d}
																value={d}
															>
																{d}
															</option>
														))}
													</select>
												) : (
													<p className="text-sm font-semibold">
														{formData.department ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Designation
												</label>
												{isEditing ? (
													<input
														name="designation"
														value={
															formData.designation
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.designation ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Joining Date
												</label>
												{isEditing ? (
													<input
														type="date"
														name="joiningDate"
														value={
															formData.joiningDate
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.joiningDate ||
															"N/A"}
													</p>
												)}
											</div>
											<div className="sm:col-span-2">
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Classes/Subjects Taught
												</label>
												{isEditing ? (
													<input
														name="classesTaught"
														value={
															formData.classesTaught
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.classesTaught ||
															"N/A"}
													</p>
												)}
											</div>
											<div className="sm:col-span-3">
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Qualifications
												</label>
												{isEditing ? (
													<input
														name="qualifications"
														value={
															formData.qualifications
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
														placeholder="e.g. M.Sc Physics, B.Ed"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.qualifications ||
															"N/A"}
													</p>
												)}
											</div>
										</>
									)}

									{/* TAB 4: Payroll & Bank */}
									{activeTab === "payroll" && (
										<>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Basic Salary (₹)
												</label>
												{isEditing ? (
													<input
														type="number"
														name="basicSalary"
														value={
															formData.basicSalary
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														₹
														{formData.basicSalary ||
															"0"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Bank Name
												</label>
												{isEditing ? (
													<input
														name="bankName"
														value={
															formData.bankName
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.bankName ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Account Number
												</label>
												{isEditing ? (
													<input
														name="accountNumber"
														value={
															formData.accountNumber
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.accountNumber ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													IFSC Code
												</label>
												{isEditing ? (
													<input
														name="ifscCode"
														value={
															formData.ifscCode
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.ifscCode ||
															"N/A"}
													</p>
												)}
											</div>
										</>
									)}
								</div>
							)}
						</div>

						{/* Footer Actions */}
						<div className="p-5 border-t border-slate-100 flex justify-between items-center bg-slate-50">
							<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
								{isEditing
									? "🖊️ Sandbox Edit Active"
									: "👁️ Safe Read Only"}
							</span>
							<div className="flex gap-3">
								<button
									onClick={handleCloseModal}
									className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
								>
									Cancel
								</button>
								{isEditing ? (
									<button
										onClick={handleSave}
										disabled={isSaving}
										className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md"
									>
										{isSaving
											? "Saving..."
											: "Commit Full Changes"}
									</button>
								) : (
									<button
										onClick={() => setIsEditing(true)}
										className="px-6 py-2 text-sm font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-xl transition-all"
									>
										Edit Entire File
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
