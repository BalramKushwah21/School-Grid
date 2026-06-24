"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	Edit,
	X,
	User,
	Briefcase,
	CreditCard,
	Loader2,
	AlertCircle,
	CheckCircle,
} from "lucide-react";

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
	const [teachers, setTeachers] = useState([]);
	const [loading, setLoading] = useState(true);

	// --- FILTER STATES ---
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDept, setSelectedDept] = useState("All Departments");

	// --- MODAL & FORM STATES ---
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

	// 1. Fetch Basic List on Mount
	useEffect(() => {
		fetchTeachersList();
	}, []);

	const fetchTeachersList = async () => {
		setLoading(true);
		try {
			// Yahan aap apna API endpoint ya server action call karenge
			const res = await fetch("/api/school/admin/teachers/get");
			const data = await res.json();
			if (data) {
				setTeachers(data);
			}
			console.log(data);
		} catch (error) {
			console.error("Failed to fetch teachers:", error);
		} finally {
			setLoading(false);
		}
	};

	// 2. CRITICAL FIX: Fetch Full Details on Click
	const handleOpenModal = async (teacherId) => {
		setIsModalOpen(true);
		setIsEditing(false); // Default to view mode
		setActiveTab("personalInfo");
		setLoadingDetails(true);

		try {
			// Yahan specific teacher ka poora data fetch kar rahe hain
			const res = await fetch(`/api/school/admin/teachers/${teacherId}`);
			const fullTeacherData = await res.json();

			if (fullTeacherData) {
				setFormData({
					id: fullTeacherData.id,
					firstName: fullTeacherData.firstName || "",
					middleName: fullTeacherData.middleName || "",
					lastName: fullTeacherData.lastName || "",
					email: fullTeacherData.email || "",
					phone: fullTeacherData.phone || "",
					dob: fullTeacherData.dateOfBirth
						? fullTeacherData.dateOfBirth.split("T")[0]
						: "",
					dateOfJoining: fullTeacherData.dateOfJoining
						? fullTeacherData.dateOfJoining.split("T")[0]
						: "",
					gender: fullTeacherData.gender || "",
					nationalIdNumber: fullTeacherData.nationalIdNumber || "",
					address: fullTeacherData.address || "",
					employeeId: fullTeacherData.employeeId || "",
					designation: fullTeacherData.designation || "",
					department: fullTeacherData.department || "",
					qualification: fullTeacherData.qualification || "",
					experience: fullTeacherData.experience || "",
					isClassTeacher: fullTeacherData.isClassTeacher || false,
					basicSalary: fullTeacherData.basicSalary || "",
					bankName: fullTeacherData.bankName || "",
					accountNumber: fullTeacherData.accountNumber || "",
					ifscCode: fullTeacherData.ifscCode || "",
					panNumber: fullTeacherData.panNumber || "",
				});
				setSelectedTeacher(fullTeacherData);
			}
		} catch (error) {
			console.error("Error fetching full teacher details:", error);
			setNotification({
				show: true,
				message: "Failed to load teacher details",
				type: "error",
			});
		} finally {
			setLoadingDetails(false);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTeacher(null);
		setFormData({});
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			// API call to save updated data
			const res = await fetch(`/api/school/admin/teachers/${formData.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				setNotification({
					show: true,
					message: "Teacher details updated successfully!",
					type: "success",
				});
				setIsEditing(false);
				fetchTeachersList(); // Refresh table data
				setTimeout(
					() =>
						setNotification({ show: false, message: "", type: "" }),
					3000,
				);
			}
		} catch (error) {
			console.error("Save error:", error);
		} finally {
			setIsSaving(false);
		}
	};

	// Filter Logic
	const filteredTeachers = teachers.filter((t) => {
		const matchesSearch =
			(t.firstName + " " + t.lastName)
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			t.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesDept =
			selectedDept === "All Departments" || t.department === selectedDept;
		return matchesSearch && matchesDept;
	});

	return (
		<div className="p-6 bg-slate-50 min-h-screen">
			<div className="max-w-7xl mx-auto">
				{/* Header & Filters */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
					<div>
						<h1 className="text-3xl font-bold text-slate-800">
							Faculty Directory
						</h1>
						<p className="text-slate-500 mt-1">
							Manage and view teacher records
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
						<div className="relative w-full sm:w-64">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
							<input
								type="text"
								placeholder="Search name or ID..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
							/>
						</div>
						<select
							value={selectedDept}
							onChange={(e) => setSelectedDept(e.target.value)}
							className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
						>
							{DEPARTMENTS.map((dept) => (
								<option key={dept} value={dept}>
									{dept}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Table */}
				<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead className="bg-slate-50 text-slate-600 text-sm border-b">
								<tr>
									<th className="py-4 px-6 font-semibold">
										Employee ID
									</th>
									<th className="py-4 px-6 font-semibold">
										Name
									</th>
									<th className="py-4 px-6 font-semibold">
										Department
									</th>
									<th className="py-4 px-6 font-semibold">
										Designation
									</th>
									<th className="py-4 px-6 font-semibold text-right">
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td
											colSpan="5"
											className="py-10 text-center text-slate-500"
										>
											<Loader2 className="animate-spin mx-auto w-6 h-6 mb-2" />
											Loading...
										</td>
									</tr>
								) : filteredTeachers.length === 0 ? (
									<tr>
										<td
											colSpan="5"
											className="py-10 text-center text-slate-500"
										>
											No teachers found
										</td>
									</tr>
								) : (
									filteredTeachers.map((teacher) => (
										<tr
											key={teacher.id}
											className="border-b hover:bg-slate-50 transition"
										>
											<td className="py-4 px-6 font-mono text-sm text-slate-600">
												{teacher.employeeId}
											</td>
											<td className="py-4 px-6 font-medium text-slate-800">
												{teacher.firstName}{" "}
												{teacher.lastName}
											</td>
											<td className="py-4 px-6 text-slate-600">
												{teacher.department}
											</td>
											<td className="py-4 px-6 text-slate-600">
												<span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
													{teacher.designation}
												</span>
											</td>
											<td className="py-4 px-6 text-right">
												<button
													onClick={() =>
														handleOpenModal(
															teacher.id,
														)
													}
													className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
												>
													View & Edit
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Modal */}
				<AnimatePresence>
					{isModalOpen && (
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
							>
								{/* Modal Header */}
								<div className="p-6 border-b flex justify-between items-center bg-slate-900 text-white">
									<div>
										<h2 className="text-xl font-bold">
											Teacher Profile
										</h2>
										<p className="text-slate-300 text-sm">
											{isEditing
												? "Editing Mode"
												: "Read-Only Mode"}
										</p>
									</div>
									<button
										onClick={handleCloseModal}
										className="p-2 hover:bg-slate-800 rounded-full transition"
									>
										<X className="w-5 h-5" />
									</button>
								</div>

								{loadingDetails ? (
									<div className="p-12 flex flex-col items-center justify-center min-h-[300px]">
										<Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
										<p className="text-slate-500 font-medium">
											Fetching complete secure records...
										</p>
									</div>
								) : (
									<>
										{/* Tabs */}
										<div className="flex border-b bg-slate-50 px-4">
											{[
												{
													id: "personalInfo",
													label: "Personal",
													icon: (
														<User className="w-4 h-4 mr-2" />
													),
												},
												{
													id: "professional",
													label: "Professional",
													icon: (
														<Briefcase className="w-4 h-4 mr-2" />
													),
												},
												{
													id: "payroll",
													label: "Payroll & Bank",
													icon: (
														<CreditCard className="w-4 h-4 mr-2" />
													),
												},
											].map((tab) => (
												<button
													key={tab.id}
													onClick={() =>
														setActiveTab(tab.id)
													}
													className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
												>
													{tab.icon} {tab.label}
												</button>
											))}
										</div>

										{/* Modal Body / Form */}
										<div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
											{activeTab === "personalInfo" && (
												<div className="grid grid-cols-2 gap-4">
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															First Name
														</label>
														<input
															type="text"
															name="firstName"
															value={
																formData.firstName
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Last Name
														</label>
														<input
															type="text"
															name="lastName"
															value={
																formData.lastName
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Email
														</label>
														<input
															type="email"
															name="email"
															value={
																formData.email
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Phone
														</label>
														<input
															type="text"
															name="phone"
															value={
																formData.phone
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Date of Birth
														</label>
														<input
															type="date"
															name="dob"
															value={formData.dob}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
												</div>
											)}

											{activeTab === "professional" && (
												<div className="grid grid-cols-2 gap-4">
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Employee ID
														</label>
														<input
															type="text"
															name="employeeId"
															value={
																formData.employeeId
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Department
														</label>
														<input
															type="text"
															name="department"
															value={
																formData.department
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Designation
														</label>
														<input
															type="text"
															name="designation"
															value={
																formData.designation
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Date of Joining
														</label>
														<input
															type="date"
															name="dateOfJoining"
															value={
																formData.dateOfJoining
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
												</div>
											)}

											{activeTab === "payroll" && (
												<div className="grid grid-cols-2 gap-4">
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Basic Salary (₹)
														</label>
														<input
															type="number"
															name="basicSalary"
															value={
																formData.basicSalary
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															PAN Number
														</label>
														<input
															type="text"
															name="panNumber"
															value={
																formData.panNumber
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none uppercase ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Bank Name
														</label>
														<input
															type="text"
															name="bankName"
															value={
																formData.bankName
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															Account Number
														</label>
														<input
															type="text"
															name="accountNumber"
															value={
																formData.accountNumber
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
													<div>
														<label className="block text-xs font-semibold text-slate-500 mb-1">
															IFSC Code
														</label>
														<input
															type="text"
															name="ifscCode"
															value={
																formData.ifscCode
															}
															onChange={
																handleChange
															}
															disabled={
																!isEditing
															}
															className={`w-full px-3 py-2 rounded-lg border outline-none uppercase ${!isEditing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white border-slate-300 focus:border-blue-500"}`}
														/>
													</div>
												</div>
											)}
										</div>

										{/* Modal Footer */}
										<div className="p-5 border-t bg-white flex justify-between items-center">
											<div className="text-sm font-medium">
												{isEditing ? (
													<span className="text-amber-600 flex items-center">
														<Edit className="w-4 h-4 mr-1" />{" "}
														Editing Mode
													</span>
												) : (
													<span className="text-slate-400">
														Read Only
													</span>
												)}
											</div>

											<div className="flex gap-3">
												<button
													onClick={handleCloseModal}
													className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
												>
													Cancel
												</button>
												{isEditing ? (
													<button
														onClick={handleSave}
														disabled={isSaving}
														className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md flex items-center"
													>
														{isSaving ? (
															<Loader2 className="w-4 h-4 animate-spin mr-2" />
														) : (
															<CheckCircle className="w-4 h-4 mr-2" />
														)}
														{isSaving
															? "Saving..."
															: "Save Changes"}
													</button>
												) : (
													<button
														onClick={() =>
															setIsEditing(true)
														}
														className="px-6 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-md flex items-center"
													>
														<Edit className="w-4 h-4 mr-2" />{" "}
														Edit Details
													</button>
												)}
											</div>
										</div>
									</>
								)}
							</motion.div>
						</div>
					)}
				</AnimatePresence>

				{/* Global Notification */}
				<AnimatePresence>
					{notification.show && (
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
							className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl flex items-center font-medium text-white ${notification.type === "error" ? "bg-red-600" : "bg-green-600"}`}
						>
							{notification.type === "error" ? (
								<AlertCircle className="w-5 h-5 mr-3" />
							) : (
								<CheckCircle className="w-5 h-5 mr-3" />
							)}
							{notification.message}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
