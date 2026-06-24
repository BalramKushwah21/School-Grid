"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerTeacher } from "@/actions/teacher.actions";
import {
	User,
	Briefcase,
	CreditCard,
	Lock,
	CheckCircle,
	ChevronRight,
	ChevronLeft,
} from "lucide-react";

// Step Definitions
const steps = [
	{
		id: "personal",
		title: "Personal Details",
		icon: <User className="w-5 h-5" />,
	},
	{
		id: "professional",
		title: "Professional",
		icon: <Briefcase className="w-5 h-5" />,
	},
	{
		id: "payroll",
		title: "Payroll & Bank",
		icon: <CreditCard className="w-5 h-5" />,
	},
	{
		id: "login",
		title: "Account & Login",
		icon: <Lock className="w-5 h-5" />,
	},
];

export default function AddTeacherPage() {
	const [currentStep, setCurrentStep] = useState(0);

	// State Initialization: All fields defined with empty strings to prevent "uncontrolled input" errors
	const [formData, setFormData] = useState({
		firstName: "",
		middleName: "",
		lastName: "",
		dob: "",
		gender: "",
		nationalIdNumber: "",
		phone: "",
		email: "",
		address: "",
		employeeId: "",
		designation: "",
		department: "",
		dateOfJoining: "",
		qualification: "",
		experience: "",
		isClassTeacher: false,
		basicSalary: "",
		bankName: "",
		accountNumber: "",
		ifscCode: "",
		panNumber: "",
		username: "",
		password: "",
		role: "TEACHER",
	});

	// Strict Navigation Handlers
	const handleNext = (e) => {
		e.preventDefault(); // Blocks form submission when clicking Next
		if (currentStep < steps.length - 1) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handlePrev = (e) => {
		e.preventDefault(); // Blocks form submission when clicking Back
		if (currentStep > 0) setCurrentStep((prev) => prev - 1);
	};

	// Keyboard Event Handler (Blocks "Enter" key submission except in Textareas)
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
			e.preventDefault();
		}
	};

	// Dynamic Input Handler
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		setFormData((prev) => {
			const updatedData = {
				...prev,
				[name]: type === "checkbox" ? checked : value,
			};

			// Auto-Sync 1: Default Username = Mobile Number
			if (name === "phone") {
				updatedData.username = value;
			}

			// Auto-Sync 2: Default Password = DOB in DDMMYYYY format
			if (name === "dob") {
				if (value) {
					const dateParts = value.split("-"); // Input returns YYYY-MM-DD
					if (dateParts.length === 3) {
						updatedData.password = `${dateParts[2]}${dateParts[1]}${dateParts[0]}`; // DDMMYYYY
					}
				} else {
					updatedData.password = "";
				}
			}

			return updatedData;
		});
	};

	// Final Form Submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await registerTeacher(formData); // Server Action
		if (result.success) {
			alert("Teacher Added Successfully!");
		} else {
			alert(result.error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-12">
			<div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
				{/* Header / Stepper UI */}
				<div className="bg-slate-900 p-6 sm:p-8 text-white">
					<h2 className="text-2xl font-bold mb-8">
						Register New Teacher
					</h2>
					<div className="flex justify-between items-center relative">
						<div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -z-10 transform -translate-y-1/2"></div>
						<motion.div
							className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 transform -translate-y-1/2"
							initial={{ width: "0%" }}
							animate={{
								width: `${(currentStep / (steps.length - 1)) * 100}%`,
							}}
							transition={{ duration: 0.4 }}
						/>

						{steps.map((step, index) => (
							<div
								key={step.id}
								className="flex flex-col items-center"
							>
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
										index <= currentStep
											? "bg-blue-600 border-blue-200"
											: "bg-slate-800 border-slate-700 text-slate-400"
									}`}
								>
									{index < currentStep ? (
										<CheckCircle className="w-5 h-5 text-white" />
									) : (
										step.icon
									)}
								</div>
								<span
									className={`hidden sm:block text-xs mt-2 font-medium ${index <= currentStep ? "text-blue-200" : "text-slate-400"}`}
								>
									{step.title}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Form Area with onKeyDown blocker */}
				<div className="p-6 sm:p-8">
					<form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
						<div className="min-h-[400px]">
							<AnimatePresence mode="wait">
								<motion.div
									key={currentStep}
									initial={{ x: 20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									exit={{ x: -20, opacity: 0 }}
									transition={{ duration: 0.3 }}
								>
									{/* STEP 1: PERSONAL INFORMATION */}
									{currentStep === 0 && (
										<div className="space-y-4">
											<h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
												1. Personal Information
											</h3>
											<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														First Name *
													</label>
													<input
														type="text"
														name="firstName"
														value={
															formData.firstName ||
															""
														}
														onChange={handleChange}
														required
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Middle Name
													</label>
													<input
														type="text"
														name="middleName"
														value={
															formData.middleName ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Last Name *
													</label>
													<input
														type="text"
														name="lastName"
														value={
															formData.lastName ||
															""
														}
														onChange={handleChange}
														required
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
													/>
												</div>
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Date of Birth
													</label>
													<input
														type="date"
														name="dob"
														value={
															formData.dob || ""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Gender
													</label>
													<select
														name="gender"
														value={
															formData.gender ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
													>
														<option value="">
															Select Gender
														</option>
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
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														ID / Aadhar Number
													</label>
													<input
														type="text"
														name="nationalIdNumber"
														value={
															formData.nationalIdNumber ||
															""
														}
														onChange={handleChange}
														placeholder="XXXX-XXXX-XXXX"
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
													/>
												</div>
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Contact Number
														(Username)
													</label>
													<input
														type="tel"
														name="phone"
														value={
															formData.phone || ""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
														placeholder="9876543210"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Email Address
													</label>
													<input
														type="email"
														name="email"
														value={
															formData.email || ""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
														placeholder="teacher@school.com"
													/>
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Residential Address
												</label>
												<textarea
													name="address"
													value={
														formData.address || ""
													}
													onChange={handleChange}
													rows="2"
													className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
													placeholder="Full permanent/current address"
												></textarea>
											</div>
										</div>
									)}

									{/* STEP 2: PROFESSIONAL DETAILS */}
									{currentStep === 1 && (
										<div className="space-y-4">
											<h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
												2. Professional Details
											</h3>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Employee ID
													</label>
													<input
														type="text"
														name="employeeId"
														value={
															formData.employeeId ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
														placeholder="e.g., TCH-001"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Designation
													</label>
													<select
														name="designation"
														value={
															formData.designation ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
													>
														<option value="">
															Select Designation
														</option>
														<option value="PGT">
															PGT (Post Graduate
															Teacher)
														</option>
														<option value="TGT">
															TGT (Trained
															Graduate Teacher)
														</option>
														<option value="PRT">
															PRT (Primary
															Teacher)
														</option>
														<option value="NTT">
															NTT (Nursery
															Teacher)
														</option>
													</select>
												</div>
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Department / Subject
													</label>
													<input
														type="text"
														name="department"
														value={
															formData.department ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
														placeholder="e.g., Mathematics, Science"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Date of Joining
													</label>
													<input
														type="date"
														name="dateOfJoining"
														value={
															formData.dateOfJoining ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
													/>
												</div>
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Highest Qualification
													</label>
													<input
														type="text"
														name="qualification"
														value={
															formData.qualification ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
														placeholder="e.g., M.Sc, B.Ed"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Experience (in Years)
													</label>
													<input
														type="number"
														name="experience"
														value={
															formData.experience ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
														placeholder="0"
														min="0"
													/>
												</div>
											</div>

											<div className="flex items-center mt-4">
												<input
													type="checkbox"
													id="isClassTeacher"
													name="isClassTeacher"
													checked={
														formData.isClassTeacher ||
														false
													}
													onChange={handleChange}
													className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
												/>
												<label
													htmlFor="isClassTeacher"
													className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
												>
													Assign as a Class Teacher
												</label>
											</div>
										</div>
									)}

									{/* STEP 3: PAYROLL & BANK DETAILS */}
									{currentStep === 2 && (
										<div className="space-y-4">
											<h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
												3. Payroll & Bank Details
											</h3>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Basic Salary (₹) / Month
													</label>
													<input
														type="number"
														name="basicSalary"
														value={
															formData.basicSalary ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
														placeholder="e.g., 45000"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														PAN Card Number
													</label>
													<input
														type="text"
														name="panNumber"
														value={
															formData.panNumber ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition uppercase"
														placeholder="ABCDE1234F"
													/>
												</div>
											</div>

											<div className="grid grid-cols-1 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Bank Name
													</label>
													<input
														type="text"
														name="bankName"
														value={
															formData.bankName ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
														placeholder="e.g., State Bank of India"
													/>
												</div>
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Account Number
													</label>
													<input
														type="text"
														name="accountNumber"
														value={
															formData.accountNumber ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
														placeholder="XXXXXXXXXXXX"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														IFSC Code
													</label>
													<input
														type="text"
														name="ifscCode"
														value={
															formData.ifscCode ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition uppercase"
														placeholder="SBIN0001234"
													/>
												</div>
											</div>
										</div>
									)}

									{/* STEP 4: LOGIN CREDENTIALS */}
									{currentStep === 3 && (
										<div className="space-y-4">
											<h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
												4. System Login Credentials
											</h3>
											<p className="text-sm text-gray-500 mb-4">
												These fields are pre-filled with
												the auto-generated defaults
												(Mobile & DOB) but you can
												modify them below if needed.
											</p>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Username / ID (Default:
														Mobile)
													</label>
													<input
														type="text"
														name="username"
														value={
															formData.username ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-blue-50 font-mono font-medium"
														placeholder="Auto-filled from contact"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Initial Password
														(Default: DDMMYYYY)
													</label>
													<input
														type="text"
														name="password"
														value={
															formData.password ||
															""
														}
														onChange={handleChange}
														className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-blue-50 font-mono font-medium"
														placeholder="Auto-filled from DOB"
													/>
												</div>
											</div>

											<div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
												<CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
												<div className="text-sm text-green-800 space-y-1">
													<p>
														<strong>
															System Configuration
															Alert:
														</strong>
													</p>
													<ul className="list-disc list-inside space-y-1">
														<li>
															Account access level
															is strictly locked
															to{" "}
															<strong>
																TEACHER
															</strong>{" "}
															role.
														</li>
														<li>
															Credentials
															auto-sync seamlessly
															when modifying Step
															1.
														</li>
														<li>
															Teacher will be
															forced to change
															this default
															password upon their
															first successful
															login.
														</li>
													</ul>
												</div>
											</div>
										</div>
									)}
								</motion.div>
							</AnimatePresence>
						</div>

						{/* Navigation Buttons */}
						<div className="flex justify-between mt-8 pt-6 border-t">
							<button
								type="button"
								onClick={handlePrev}
								disabled={currentStep === 0}
								className={`flex items-center px-6 py-2 rounded-lg font-medium transition ${
									currentStep === 0
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								<ChevronLeft className="w-4 h-4 mr-2" /> Back
							</button>

							{/* Conditional rendering based on step */}
							{currentStep < steps.length - 1 ? (
								<button
									type="button"
									onClick={handleNext}
									className="flex items-center px-8 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200"
								>
									Next{" "}
									<ChevronRight className="w-4 h-4 ml-2" />
								</button>
							) : (
								<button
									type="submit"
									className="flex items-center px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-lg shadow-green-200"
								>
									Submit Registration{" "}
									<CheckCircle className="w-4 h-4 ml-2" />
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
