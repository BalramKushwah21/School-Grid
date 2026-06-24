"use client";

import React, { useState, useEffect, useMemo } from "react";
import { User, ShieldCheck, Eye, Search, Filter, Layers, CreditCard, HeartPulse } from "lucide-react";

export default function TeacherStudentDirectory() {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Filter states
	const [searchTerm, setSearchTerm] = useState("");
	const [classFilter, setClassFilter] = useState("All");
	const [routeFilter, setRouteFilter] = useState("All");
	const [statusFilter, setStatusFilter] = useState("All");

	// Modal & Tab control states
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [activeTab, setActiveTab] = useState("studentInfo");
	const [formData, setFormData] = useState({});

	// Fetch master list from backend matching your API layer
	const fetchStudents = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/school/admin/students/get");
			if (!response.ok) throw new Error("Failed to fetch records.");
			const result = await response.json();
			setStudents(result.data || []);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStudents();
	}, []);

	// Load full read-only dataset for the student on view click
	const handleViewClick = async (studentId) => {
		setIsModalOpen(true);
		setLoadingDetails(true);
		setActiveTab("studentInfo");

		try {
			const response = await fetch(`/api/school/admin/students/${studentId}`);
			if (!response.ok) throw new Error("Failed to get admission dossier.");
			const result = await response.json();
			const std = result.data;
			setSelectedStudent(std);

			// Map exact database values to read-only layout variables
			setFormData({
				admissionDate: std.admissionDate ? new Date(std.admissionDate).toISOString().split("T")[0] : "N/A",
				rollNumber: std.rollNumber || "N/A",
				firstName: std.firstName || "N/A",
				lastName: std.lastName || "N/A",
				gender: std.gender || "N/A",
				dob: std.dateOfBirth ? new Date(std.dateOfBirth).toISOString().split("T")[0] : "N/A",
				bloodGroup: std.bloodGroup || "N/A",
				category: std.category || "N/A",
				religion: std.religion || "N/A",
				nationality: std.nationality || "Indian",
				isStaffChild: std.isStaffChild ? "Yes" : "No",
				identificationMark: std.identificationMark || "None",
				aadhar: std.nationalIdNumber || "N/A",
				abcId: std.abcId || "N/A",
				panNumber: std.panNumber || "N/A",

				classApplyingFor: std.academicProfile?.currentClass || "N/A",
				section: std.academicProfile?.section || "Not Assigned",
				previousSchool: std.academicProfile?.previousSchool || "N/A",
				previousClass: std.academicProfile?.previousClass || "N/A",
				tcNumber: std.academicProfile?.tcNumber || "N/A",
				previousUdiseCode: std.academicProfile?.previousUdiseCode || "N/A",
				academicSession: std.academicProfile?.academicSession || "N/A",
				previousMediumOfInstruction: std.academicProfile?.previousSchoolMedium || "English",
				boardRegistrationNumber: std.academicProfile?.boardRegistrationNo || "N/A",

				parentsMaritalStatus: std.family?.parentsMaritalStatus || "Married",
				legalCustodyHolder: std.family?.legalCustodyHolder || "Both",
				fatherName: std.family?.fatherName || "N/A",
				fatherMobile: std.family?.fatherMobile || "N/A",
				fatherOccupation: std.family?.fatherOccupation || "N/A",
				fatherIncome: std.family?.fatherIncome || "N/A",
				fatherEmail: std.family?.fatherEmail || "N/A",
				motherName: std.family?.motherName || "N/A",
				motherMobile: std.family?.motherMobile || "N/A",
				motherOccupation: std.family?.motherOccupation || "N/A",
				motherEmail: std.family?.motherEmail || "N/A",
				siblingStudyingHere: std.family?.siblingStudyingHere ? "Yes" : "No",
				siblingDetails: std.family?.siblingDetails || "None",

				houseNo: std.family?.address?.houseNo || "",
				street: std.family?.address?.street || "",
				city: std.family?.address?.city || "",
				district: std.family?.address?.district || "",
				state: std.family?.address?.state || "",
				pincode: std.family?.address?.pincode || "",

				emergencyContact: std.medicalProfile?.emergencyContactName || "N/A",
				emergencyMobile: std.medicalProfile?.emergencyContactNumber || "N/A",
				emergencyRelation: std.medicalProfile?.relationWithStudent || "N/A",
				familyDoctorName: std.medicalProfile?.familyDoctorName || "N/A",
				familyDoctorMobile: std.medicalProfile?.familyDoctorContactNumber || "N/A",
				preferredHospital: std.medicalProfile?.preferredHospital || "N/A",
				medicalConditions: std.medicalProfile?.medicalConditions || "None Enlisted",
				allergies: std.medicalProfile?.allergies || "None Enlisted",

				feeCategory: std.feeRecord?.feeCategory || "GENERAL",
				scholarship: std.feeRecord?.scholarship ? "Yes" : "No",
				concessionDetails: std.feeRecord?.concessionDetails || "N/A",
				admissionFeePaid: std.feeRecord?.admissionFeePaid || "0",
				transportFeePaid: std.feeRecord?.transportFeePaid || "0",
				securityDepositPaid: std.feeRecord?.securityDepositPaid || "0",
				tuitionFeeCycle: std.feeRecord?.tuitionFeeCycle || "QUARTERLY",
				paymentMode: std.feeRecord?.paymentMode || "CASH",
				bankName: std.feeRecord?.bankName || "N/A",
				accountNumber: std.feeRecord?.accountNumber || "N/A",
				ifscCode: std.ifscCode || "N/A",
				branchNameAndCode: std.feeRecord?.branchNameAndCode || "N/A",

				needTransport: std.transportProfile?.needTransport ? "Yes" : "No",
				pickupPoint: std.transportProfile?.pickupPoint || "N/A",
				route: std.transportProfile?.route || "Self / Private",
			});
		} catch (err) {
			alert(err.message);
			setIsModalOpen(false);
		} finally {
			setLoadingDetails(false);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setTimeout(() => setSelectedStudent(null), 300);
	};

	// Client side dynamic filters
	const filteredStudents = useMemo(() => {
		return students.filter((student) => {
			const matchesSearch =
				student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesClass = classFilter === "All" || student.class.includes(classFilter);
			const matchesRoute =
				routeFilter === "All" ||
				(routeFilter === "Transport" && student.route !== "Self / Private") ||
				(routeFilter === "Self" && student.route === "Self / Private");
			const matchesStatus = statusFilter === "All" || student.status === statusFilter;
			return matchesSearch && matchesClass && matchesRoute && matchesStatus;
		});
	}, [students, searchTerm, classFilter, routeFilter, statusFilter]);

	const uniqueClasses = useMemo(() => {
		return [
			"All",
			...new Set(students.map((s) => s.class.split(" ")[0]).filter((c) => c !== "N/A")),
		].sort();
	}, [students]);

	return (
		<div className="min-h-screen bg-slate-50 p-4 sm:p-8 animate-in fade-in duration-500">
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 max-w-7xl mx-auto">
				
				{/* Premium Teacher Section Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
					<div>
						<h2 className="text-2xl font-bold text-slate-800 tracking-tight">
							Student Roster Directory
						</h2>
						<p className="text-sm text-slate-500 mt-1">
							Authorized view access to student profiles, familial dynamics, and medical logs.
						</p>
					</div>
					<div className="bg-teal-50 border border-teal-200 text-teal-800 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 self-start sm:self-auto">
						<ShieldCheck size={14} /> Faculty Portal Active
					</div>
				</div>

				{/* Custom Filters Context Controller */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
					<div>
						<label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
							Search Records
						</label>
						<input
							type="text"
							placeholder="Type Student Name or Roll..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white outline-none transition-all"
						/>
					</div>
					<div>
						<label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
							Grade Stream
						</label>
						<select
							value={classFilter}
							onChange={(e) => setClassFilter(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white outline-none transition-all"
						>
							{uniqueClasses.map((cls) => (
								<option key={cls} value={cls}>
									{cls === "All" ? "All Assigned Grades" : `Class ${cls}`}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
							Transit Route
						</label>
						<select
							value={routeFilter}
							onChange={(e) => setRouteFilter(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white outline-none transition-all"
						>
							<option value="All">All Routes</option>
							<option value="Transport">School Bus Transit</option>
							<option value="Self">Self / Private Commute</option>
						</select>
					</div>
					<div>
						<label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
							Enrollment Status
						</label>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white outline-none transition-all"
						>
							<option value="All">All Statuses</option>
							<option value="Active">Active Enrolments</option>
						</select>
					</div>
				</div>

				{/* High Density Roster Data Table */}
				<div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
								<th className="p-4 w-28">Roll No</th>
								<th className="p-4">Student Profile Name</th>
								<th className="p-4">Assigned Class</th>
								<th className="p-4">Guardian Contact</th>
								<th className="p-4 text-center">Attendance %</th>
								<th className="p-4">Date of Birth</th>
								<th className="p-4 text-right">Fee Dues Summary</th>
								<th className="p-4 text-center">Action Ledger</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
							{loading ? (
								<tr>
									<td colSpan="8" className="p-12 text-center text-teal-600 font-medium animate-pulse">
										Synchronizing school cluster roster ledger...
									</td>
								</tr>
							) : filteredStudents.length > 0 ? (
								filteredStudents.map((student) => (
									<tr key={student.id} className="hover:bg-slate-50/60 transition-colors group">
										<td className="p-4 font-mono font-bold text-slate-600">
											{student.rollNumber}
										</td>
										<td className="p-4 font-semibold text-slate-900">
											{student.name}
										</td>
										<td className="p-4 font-medium text-slate-600">
											{student.class}
										</td>
										<td className="p-4 text-slate-500 font-mono">
											{student.phone}
										</td>
										<td className="p-4 text-center">
											<span className="bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-md text-xs font-bold">
												{student.attendance}
											</span>
										</td>
										<td className="p-4 text-slate-500 font-mono">
											{student.dob}
										</td>
										<td className="p-4 text-right font-bold text-slate-900">
											₹{student.dueAmount.toLocaleString("en-IN")}
										</td>
										<td className="p-4 text-center">
											<button
												onClick={() => handleViewClick(student.id)}
												className="text-xs font-bold text-teal-700 hover:text-white border border-teal-100 bg-teal-50 hover:bg-teal-600 rounded-lg px-3 py-1.5 transition-all flex items-center gap-1.5 mx-auto shadow-xs"
											>
												<Eye size={12} /> View Dossier
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="8" className="p-12 text-center text-slate-400 italic">
										No student matching criteria found inside your assigned cohort map.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* --- SAFE READ-ONLY 5-TAB PROFILE CONFIGURATOR MODAL --- */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
						
						{/* Modal Header */}
						<div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/80">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-100">
									<User size={20} />
								</div>
								<div>
									<h3 className="font-bold text-xl text-slate-900">
										Student Full Admission Dossier
									</h3>
									<p className="text-xs text-slate-400 mt-0.5 font-medium">
										System UID Mapping Key: <span className="font-mono text-slate-700 font-bold">{selectedStudent?.id || "N/A"}</span>
									</p>
								</div>
							</div>
							<button
								onClick={handleCloseModal}
								className="text-slate-400 hover:text-rose-600 transition-colors bg-white border border-slate-200 p-2 rounded-full hover:shadow-xs"
							>
								✕
							</button>
						</div>

						{/* Read-Only Tab Controller */}
						<div className="flex border-b border-slate-200 bg-slate-50/50 px-5 gap-1 overflow-x-auto text-xs font-bold uppercase tracking-wider text-slate-500 scrollbar-none">
							{[
								{ id: "studentInfo", label: "👤 Personal Profile Data" },
								{ id: "academic", label: "📚 Academic Framework" },
								{ id: "family", label: "👨‍👩‍👦 Core Parent Identity" },
								{ id: "address", label: "🏠 Infrastructure & Health" },
								{ id: "financial", label: "💰 Financials & Route mapping" },
							].map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`py-4 px-4 border-b-2 transition-all whitespace-nowrap font-bold text-[11px] ${
										activeTab === tab.id 
											? "border-teal-600 text-teal-700 bg-white" 
											: "border-transparent hover:text-slate-800 hover:bg-slate-100/50"
									}`}
								>
									{tab.label}
								</button>
							))}
						</div>

						{/* Read-Only Information Presentation View */}
						<div className="p-6 overflow-y-auto flex-1 bg-white">
							{loadingDetails ? (
								<div className="flex flex-col justify-center items-center h-48 space-y-2">
									<div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div>
									<span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parsing Profile Binders...</span>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									
									{/* TAB 1: Student Core Profile Data */}
									{activeTab === "studentInfo" && (
										<>
											{[
												{ label: "Official Admission Date", value: formData.admissionDate },
												{ label: "Assigned Roll Number", value: formData.rollNumber },
												{ label: "First Name", value: formData.firstName },
												{ label: "Last Name", value: formData.lastName },
												{ label: "Gender Parameter", value: formData.gender },
												{ label: "Date of Birth (DOB)", value: formData.dob },
												{ label: "Blood Group Matrix", value: formData.bloodGroup },
												{ label: "Category Block", value: formData.category },
												{ label: "Religion Index", value: formData.religion },
												{ label: "Nationality Profile", value: formData.nationality },
												{ label: "National ID / Aadhar Card", value: formData.aadhar },
												{ label: "Academic Bank of Credits (ABC ID)", value: formData.abcId },
												{ label: "PAN Card Number", value: formData.panNumber },
												{ label: "Faculty / Staff Child Status", value: formData.isStaffChild },
												{ label: "Visible Identification Mark", value: formData.identificationMark },
											].map((item, index) => (
												<div key={index} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
													<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{item.label}</span>
													<p className="text-sm font-semibold text-slate-800 font-mono">{item.value}</p>
												</div>
											))}
										</>
									)}

									{/* TAB 2: Academic History Framework */}
									{activeTab === "academic" && (
										<>
											{[
												{ label: "Current Class Allocation", value: formData.classApplyingFor },
												{ label: "Allocated Classroom Section", value: formData.section },
												{ label: "Active Academic Session Year", value: formData.academicSession },
												{ label: "Previous Attended School Name", value: formData.previousSchool },
												{ label: "Previous Attended Grade Level", value: formData.previousClass },
												{ label: "Transfer Certificate (TC) Number", value: formData.tcNumber },
												{ label: "Previous Institutional UDISE Code", value: formData.previousUdiseCode },
												{ label: "Medium of Instruction", value: formData.previousMediumOfInstruction },
												{ label: "Affiliated Board Registration Number", value: formData.boardRegistrationNumber },
											].map((item, index) => (
												<div key={index} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
													<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{item.label}</span>
													<p className="text-sm font-semibold text-slate-800">{item.value}</p>
												</div>
											))}
										</>
									)}

									{/* TAB 3: Parent Identity Portals */}
									{activeTab === "family" && (
										<>
											<div className="md:col-span-3 bg-teal-50/40 p-3 rounded-xl border border-teal-100 text-teal-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
												<Layers size={14} /> Marital & Custody Matrix Setup
											</div>
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1heading">Parents Marital Status</span>
												<p className="text-sm font-semibold text-slate-800">{formData.parentsMaritalStatus}</p>
											</div>
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 md:col-span-2">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Legal Custody Holder Profile</span>
												<p className="text-sm font-semibold text-slate-800">{formData.legalCustodyHolder}</p>
											</div>

											<div className="md:col-span-3 bg-slate-100 p-2.5 rounded-xl text-slate-700 font-bold text-xs uppercase tracking-wider mt-2">
												Father Demographics Ledger
											</div>
											{[
												{ label: "Father's Full Legal Name", value: formData.fatherName },
												{ label: "Primary Mobile Number", value: formData.fatherMobile },
												{ label: "Professional Occupation", value: formData.fatherOccupation },
												{ label: "Declared Annual Income", value: formData.fatherIncome },
												{ label: "Registered Email ID", value: formData.fatherEmail },
											].map((item, index) => (
												<div key={index} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
													<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{item.label}</span>
													<p className="text-sm font-semibold text-slate-800">{item.value}</p>
												</div>
											))}

											<div className="md:col-span-3 bg-slate-100 p-2.5 rounded-xl text-slate-700 font-bold text-xs uppercase tracking-wider mt-2">
												Mother Demographics Ledger
											</div>
											{[
												{ label: "Mother's Full Legal Name", value: formData.motherName },
												{ label: "Primary Mobile Number", value: formData.motherMobile },
												{ label: "Professional Occupation", value: formData.motherOccupation },
												{ label: "Registered Email ID", value: formData.motherEmail },
											].map((item, index) => (
												<div key={index} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
													<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{item.label}</span>
													<p className="text-sm font-semibold text-slate-800">{item.value}</p>
												</div>
											))}

											<div className="md:col-span-3 bg-slate-100 p-2.5 rounded-xl text-slate-700 font-bold text-xs uppercase tracking-wider mt-2">
												Siblings Tracking Ledger
											</div>
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1heading">Sibling Enrolled Here?</span>
												<p className="text-sm font-semibold text-slate-800">{formData.siblingStudyingHere}</p>
											</div>
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 md:col-span-2">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1heading">Sibling Names & Academic Cohorts</span>
												<p className="text-sm font-semibold text-slate-800">{formData.siblingDetails}</p>
											</div>
										</>
									)}

									{/* TAB 4: Address Map & Medical Logs */}
									{activeTab === "address" && (
										<>
											<div className="md:col-span-3 bg-slate-100 p-2.5 rounded-xl text-slate-700 font-bold text-xs uppercase tracking-wider">
												Permanent / Residential Address Records
											</div>
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">House / Apartment No</span>
												<p className="text-sm font-semibold text-slate-800">{formData.houseNo || "N/A"}</p>
											</div>
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 md:col-span-2">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Street Layout / Locality</span>
												<p className="text-sm font-semibold text-slate-800">{formData.street || "N/A"}</p>
											</div>
											{[
												{ label: "City / Town", value: formData.city },
												{ label: "District Block", value: formData.district },
												{ label: "State Territory", value: formData.state },
												{ label: "Postal Pincode", value: formData.pincode },
											].map((item, index) => (
												<div key={index} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
													<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{item.label}</span>
													<p className="text-sm font-semibold text-slate-800">{item.value || "N/A"}</p>
												</div>
											))}

											<div className="md:col-span-3 bg-teal-50/40 p-3 rounded-xl border border-teal-100 text-teal-800 font-bold text-xs uppercase tracking-wider mt-2 flex items-center gap-2">
												<HeartPulse size={14} /> Emergency Medical File
											</div>
											{[
												{ label: "Emergency Contact Person", value: formData.emergencyContact },
												{ label: "Emergency Contact Mobile", value: formData.emergencyMobile },
												{ label: "Relation with Student", value: formData.emergencyRelation },
												{ label: "Family Doctor Name", value: formData.familyDoctorName },
												{ label: "Doctor Primary Contact", value: formData.familyDoctorMobile },
												{ label: "Preferred Emergency Hospital", value: formData.preferredHospital },
											].map((item, index) => (
												<div key={index} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
													<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{item.label}</span>
													<p className="text-sm font-semibold text-slate-800">{item.value}</p>
												</div>
											))}
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 md:col-span-2">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Chronic Medical Conditions / History</span>
												<p className="text-sm font-semibold text-slate-800">{formData.medicalConditions}</p>
											</div>
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Identified Allergies</span>
												<p className="text-sm font-semibold text-slate-800">{formData.allergies}</p>
											</div>
										</>
									)}

									{/* TAB 5: Financial Allocations & Bus Routes */}
									{activeTab === "financial" && (
										<>
											<div className="md:col-span-3 bg-slate-100 p-2.5 rounded-xl text-slate-700 font-bold text-xs uppercase tracking-wider">
												Fee Structure Setup & Ledger Audit
											</div>
											{[
												{ label: "Fee Allocation Category", value: formData.feeCategory },
												{ label: "Scholarship Status", value: formData.scholarship },
												{ label: "Concession Reference Scope", value: formData.concessionDetails },
												{ label: "Admission Fee Collected", value: `₹${parseFloat(formData.admissionFeePaid).toLocaleString("en-IN")}` },
												{ label: "Transport Fee Collected", value: `₹${parseFloat(formData.transportFeePaid).toLocaleString("en-IN")}` },
												{ label: "Security Deposit Vault Status", value: `₹${parseFloat(formData.securityDepositPaid).toLocaleString("en-IN")}` },
												{ label: "Tuition Invoice Billing Cycle", value: formData.tuitionFeeCycle },
												{ label: "Payment Mode Method", value: formData.paymentMode },
											].map((item, index) => (
												<div key={index} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
													<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{item.label}</span>
													<p className="text-sm font-semibold text-slate-800 font-mono">{item.value}</p>
												</div>
											))}

											<div className="md:col-span-3 bg-slate-100 p-2.5 rounded-xl text-slate-700 font-bold text-xs uppercase tracking-wider mt-2 flex items-center gap-2">
												<CreditCard size={14} /> Linked Bank Remittance Account
											</div>
											{[
												{ label: "Bank Institution Name", value: formData.bankName },
												{ label: "Account Number", value: formData.accountNumber },
												{ label: "IFSC Code", value: formData.ifscCode },
												{ label: "Branch Name & System Code", value: formData.branchNameAndCode },
											].map((item, index) => (
												<div key={index} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
													<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{item.label}</span>
													<p className="text-sm font-semibold text-slate-800 font-mono">{item.value}</p>
												</div>
											))}

											<div className="md:col-span-3 bg-slate-100 p-2.5 rounded-xl text-slate-700 font-bold text-xs uppercase tracking-wider mt-2">
												School Transit & Fleet Parameters
											</div>
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Requires School Transport?</span>
												<p className="text-sm font-semibold text-slate-800">{formData.needTransport}</p>
											</div>
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Pickup Station / Point</span>
												<p className="text-sm font-semibold text-slate-800">{formData.pickupPoint}</p>
											</div>
											<div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
												<span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Allocated Transport Route Code</span>
												<p className="text-sm font-semibold text-slate-800 font-mono">{formData.route}</p>
											</div>
										</>
									)}
								</div>
							)}
						</div>

						{/* Modal Footer Controls */}
						<div className="p-5 border-t border-slate-100 flex justify-between items-center bg-slate-50">
							<span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
								<span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> Authorized Faculty Mode • Read Only Security Locked
							</span>
							<button
								onClick={handleCloseModal}
								className="px-6 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-md"
							>
								Dismiss Dossier File
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}