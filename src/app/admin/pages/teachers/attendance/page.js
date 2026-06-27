"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Search, Loader2, Save, BookOpen } from "lucide-react";

export default function TeacherAttendanceManager() {
	// ================= STATES =================
	const [attendanceDate, setAttendanceDate] = useState(
		new Date().toISOString().split("T")[0],
	);
	const [searchTerm, setSearchTerm] = useState("");

	// Data States
	const [teachersList, setTeachersList] = useState([]);
	const [attendance, setAttendance] = useState({});
	const [remarks, setRemarks] = useState({});

	// Loading & Sync States
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isSaved, setIsSaved] = useState(true);

	// ================= FETCH LOGIC =================
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				// Parallel API calls for performance optimization
				const [teachersRes, attendanceRes] = await Promise.all([
					fetch(`/api/school/admin/teachers/get`), // Existing Teacher API
					fetch(
						`/api/school/admin/teachers/attendance?date=${attendanceDate}`,
					), // Attendance API
				]);

				if (teachersRes.ok && attendanceRes.ok) {
					const teachersData = await teachersRes.json();
					const attendanceData = await attendanceRes.json();

					// Safely handle depending on how your existing API returns data
					const rawTeachers =
						teachersData.teachers || teachersData || [];

					// Format teachers so frontend doesn't break even if raw API format differs
					const formatted = rawTeachers.map((t) => ({
						id: t.id,
						employeeId: t.employeeId || "N/A",
						fullName:
							t.fullName ||
							`${t.firstName || ""} ${t.lastName || ""}`.trim(),
						designation: t.designation || "Teacher",
						profilePhoto: t.profilePhoto || null,
					}));

					setTeachersList(formatted);

					// Populate Attendance states
					const initialAttendance = {};
					const initialRemarks = {};

					formatted.forEach((teacher) => {
						initialAttendance[teacher.id] =
							attendanceData.attendanceRecords?.[teacher.id] ||
							"present";
						initialRemarks[teacher.id] =
							attendanceData.remarksRecords?.[teacher.id] || "";
					});

					setAttendance(initialAttendance);
					setRemarks(initialRemarks);
					setIsSaved(true);
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [attendanceDate]);

	// ================= HANDLERS =================
	const handleStatusChange = (id, status) => {
		setAttendance((prev) => ({ ...prev, [id]: status }));
		setIsSaved(false);
	};

	const handleRemarkChange = (id, text) => {
		setRemarks((prev) => ({ ...prev, [id]: text }));
		setIsSaved(false);
	};

	const handleMarkAll = (status) => {
		const updated = {};
		teachersList.forEach((teacher) => {
			updated[teacher.id] = status;
		});
		setAttendance(updated);
		setIsSaved(false);
	};

	const handleSaveToDatabase = async () => {
		setIsSaving(true);
		try {
			const response = await fetch(
				"/api/school/admin/teachers/attendance",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						date: attendanceDate,
						attendanceData: attendance,
						remarksData: remarks,
					}),
				},
			);

			if (response.ok) {
				setIsSaved(true);
			} else {
				alert("Failed to save attendance.");
			}
		} catch (error) {
			console.error("Save error:", error);
		} finally {
			setIsSaving(false);
		}
	};

	// ================= COMPUTED DATA =================
	const filteredTeachers = useMemo(() => {
		return teachersList.filter(
			(teacher) =>
				teacher.fullName
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				teacher.employeeId
					.toLowerCase()
					.includes(searchTerm.toLowerCase()),
		);
	}, [teachersList, searchTerm]);

	const stats = useMemo(() => {
		const total = teachersList.length;
		let present = 0,
			absent = 0,
			late = 0;

		teachersList.forEach((t) => {
			if (attendance[t.id] === "present") present++;
			if (attendance[t.id] === "absent") absent++;
			if (attendance[t.id] === "late") late++;
		});

		return { total, present, absent, late };
	}, [teachersList, attendance]);

	return (
		<div className="min-h-screen bg-slate-50/50 p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* HEADER */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
					<div>
						<h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
							<BookOpen className="w-6 h-6 text-indigo-600" />
							Faculty Roll Call
						</h1>
						<p className="text-sm text-slate-500 font-medium mt-1">
							Mark daily attendance for all teaching staff
							members.
						</p>
					</div>
				</div>

				{/* CONTROLS & STATS */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
								Total Teachers
							</span>
							<span className="text-2xl font-black text-slate-900">
								{stats.total}
							</span>
						</div>
						<div className="bg-white p-4 rounded-xl border border-teal-100 shadow-sm text-center">
							<span className="block text-[10px] font-bold text-teal-500 uppercase tracking-wider mb-1">
								Present
							</span>
							<span className="text-2xl font-black text-teal-600">
								{stats.present}
							</span>
						</div>
						<div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm text-center">
							<span className="block text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">
								Absent
							</span>
							<span className="text-2xl font-black text-rose-600">
								{stats.absent}
							</span>
						</div>
						<div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm text-center">
							<span className="block text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">
								Late
							</span>
							<span className="text-2xl font-black text-amber-500">
								{stats.late}
							</span>
						</div>
					</div>

					<div className="space-y-4">
						<div className="relative">
							<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<input
								type="date"
								value={attendanceDate}
								onChange={(e) =>
									setAttendanceDate(e.target.value)
								}
								className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
							/>
						</div>
						<button
							onClick={handleSaveToDatabase}
							disabled={isSaving || isSaved}
							className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
								isSaved
									? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
									: "bg-indigo-600 hover:bg-indigo-700 text-white"
							}`}
						>
							{isSaving ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
							{isSaved ? "Saved to Database" : "Sync Attendance"}
						</button>
					</div>
				</div>

				{/* ATTENDANCE ROSTER */}
				<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
					<div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
						<div className="relative w-full sm:w-72">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<input
								type="text"
								placeholder="Search teacher by name or ID..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => handleMarkAll("present")}
								className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 transition"
							>
								Mark All Present
							</button>
							<button
								onClick={() => handleMarkAll("absent")}
								className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 transition"
							>
								Mark All Absent
							</button>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-50/50">
									<th className="p-4 w-24">Emp ID</th>
									<th className="p-4">Teacher Details</th>
									<th className="p-4 w-72 text-center">
										Status Action
									</th>
									<th className="p-4">Remarks</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 text-sm">
								{isLoading ? (
									<tr>
										<td
											colSpan="4"
											className="p-12 text-center text-slate-400"
										>
											<Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />{" "}
											Fetching Database...
										</td>
									</tr>
								) : filteredTeachers.length === 0 ? (
									<tr>
										<td
											colSpan="4"
											className="p-12 text-center text-slate-400 font-medium"
										>
											No teachers found.
										</td>
									</tr>
								) : (
									filteredTeachers.map((teacher) => {
										const currentStatus =
											attendance[teacher.id] || "present";
										return (
											<tr
												key={teacher.id}
												className="hover:bg-slate-50/50 transition-colors"
											>
												<td className="p-4 font-mono font-bold text-slate-500 text-xs">
													{teacher.employeeId}
												</td>
												<td className="p-4">
													<div className="flex items-center gap-3">
														{teacher.profilePhoto ? (
															<img
																src={
																	teacher.profilePhoto
																}
																alt={
																	teacher.fullName
																}
																className="w-8 h-8 rounded-full object-cover border border-slate-200"
															/>
														) : (
															<div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
																{teacher.fullName.charAt(
																	0,
																)}
															</div>
														)}
														<div>
															<p className="font-bold text-slate-900">
																{
																	teacher.fullName
																}
															</p>
															<p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
																{
																	teacher.designation
																}
															</p>
														</div>
													</div>
												</td>
												<td className="p-4">
													<div className="flex gap-1 bg-slate-100 p-1 rounded-xl max-w-[240px] mx-auto">
														{[
															"present",
															"absent",
															"late",
														].map((status) => (
															<button
																key={status}
																onClick={() =>
																	handleStatusChange(
																		teacher.id,
																		status,
																	)
																}
																className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
																	currentStatus ===
																	status
																		? status ===
																			"present"
																			? "bg-teal-600 text-white shadow-sm"
																			: status ===
																				  "absent"
																				? "bg-rose-600 text-white shadow-sm"
																				: "bg-amber-500 text-white shadow-sm"
																		: "text-slate-500 hover:bg-slate-200"
																}`}
															>
																{status}
															</button>
														))}
													</div>
												</td>
												<td className="p-4">
													<input
														type="text"
														placeholder="Add note..."
														value={
															remarks[
																teacher.id
															] || ""
														}
														onChange={(e) =>
															handleRemarkChange(
																teacher.id,
																e.target.value,
															)
														}
														className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 outline-none font-medium focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all"
													/>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
