"use client";

import React, { useState } from "react";

export default function StudentAdmissionForm() {
	const initialFormData = {
		// 1. Student Info
		admissionDate: "",
		firstName: "",
		lastName: "",
		gender: "",
		dob: "",
		bloodGroup: "",
		category: "",
		religion: "",
		nationality: "Indian",
		isStaffChild: "No",
		identificationMark: "",
		idCardNumber: "", // Generic label for national identity cards

		// 2. Academic Info
		classApplyingFor: "",
		section: "",
		previousSchool: "",
		previousClass: "",
		tcNumber: "",
		udiseNumber: "",
		academicSession: "",
		previousMediumOfInstruction: "English",
		boardRegistrationNumber: "",

		// 3. Parent/Guardian Info
		parentsMaritalStatus: "Married",
		legalCustodyHolder: "Both",
		fatherName: "",
		fatherMobile: "",
		fatherOccupation: "",
		fatherIncome: "",
		fatherEmail: "",
		motherName: "",
		motherMobile: "",
		motherOccupation: "",
		motherEmail: "",

		// Siblings Tracker
		siblingStudyingHere: "No",
		siblingDetails: "",

		// 4. Address Info
		houseNo: "",
		street: "",
		city: "",
		district: "",
		state: "",
		pincode: "",

		// 5. Emergency & Medical
		emergencyContact: "",
		emergencyMobile: "",
		emergencyRelation: "",
		medicalConditions: "",
		allergies: "",
		familyDoctorName: "",
		familyDoctorMobile: "",
		preferredHospital: "",

		// 6. Transport Info
		needTransport: "No",
		pickupPoint: "",
		route: "",

		// 7. Comprehensive Fee Information
		feeCategory: "General", // General, Staff Discount, Sibling Discount, EWS, Merit Scholarship
		scholarship: "No",
		concessionDetails: "",
		admissionFeePaid: "",
		tuitionFeeCycle: "Quarterly", // Monthly, Quarterly, Annually
		transportFeePaid: "",
		securityDepositPaid: "",
		paymentMode: "Cash", // Cash, Bank Transfer, Card, Cheque
	};

	const [formData, setFormData] = useState(initialFormData);

	const [files, setFiles] = useState({
		studentPhoto: null,
		birthCertificate: null,
		studentIdCopy: null,
		previousMarksheet: null,
		transferCertificate: null,
		parentIdCopy: null,
	});

	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const { name, files: uploadedFiles } = e.target;
		setFiles((prev) => ({ ...prev, [name]: uploadedFiles[0] }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage("");
		setSuccessMessage("");

		try {
			const response = await fetch("/api/school/student/admission", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (!response.ok) {
				if (response.status === 401) {
					setErrorMessage("You are not authorized. Please log in again.");
					alert("You are not authorized. Please log in again.");
					return;
				}
				throw new Error(result.error || "Failed to submit admission form.");
			}

			if (response.ok) {
				setSuccessMessage(`Successfully registered student: ${result.data.firstName}!`);
				setFormData(initialFormData); // Reset the form
				window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top to show the success message
				alert("Successfully registered student");
			}
		} catch (error) {
			console.error("Submission error:", error);
			setErrorMessage(error.message || "An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	
  

	return (
		<div className="bg-slate-50">
			<div className=" bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-10">
				{/* Form Header */}
				<div className="text-center border-b border-slate-100 pb-6">
					<h2 className="text-3xl font-bold text-slate-800">
						Comprehensive Student Admission Form
					</h2>
					<p className="mt-2 text-sm text-slate-500">
						Ensure all legal framework, academic history, and
						financial details are correct.
					</p>
				</div>

				{successMessage && (
					<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl relative" role="alert">
						<span className="block sm:inline">{successMessage}</span>
					</div>
				)}
				
				{errorMessage && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
						<span className="block sm:inline">{errorMessage}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-10">
					{/* 1. STUDENT INFORMATION */}
					<section className="space-y-4">
						<h3 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2 flex items-center gap-2">
							<span>👨‍🎓</span> Student Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									First Name *
								</label>
								<input
									required
									type="text"
									name="firstName"
									value={formData.firstName}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Last Name *
								</label>
								<input
									required
									type="text"
									name="lastName"
									value={formData.lastName}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Admission Date *
								</label>
								<input
									required
									type="date"
									name="admissionDate"
									value={formData.admissionDate}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Gender *
								</label>
								<select
									required
									name="gender"
									value={formData.gender}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								>
									<option value="">Select Gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Date of Birth *
								</label>
								<input
									required
									type="date"
									name="dob"
									value={formData.dob}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Blood Group
								</label>
								<input
									type="text"
									placeholder="e.g., O+"
									name="bloodGroup"
									value={formData.bloodGroup}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Category *
								</label>
								<select
									required
									name="category"
									value={formData.category}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								>
									<option value="">Select Category</option>
									<option value="General">General</option>
									<option value="OBC">OBC</option>
									<option value="SC">SC</option>
									<option value="ST">ST</option>
								</select>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Nationality
								</label>
								<input
									type="text"
									name="nationality"
									value={formData.nationality}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Staff Child?
								</label>
								<select
									name="isStaffChild"
									value={formData.isStaffChild}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								>
									<option value="No">No</option>
									<option value="Yes">Yes</option>
								</select>
							</div>
							<div className="md:col-span-2">
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Visible Identification Mark
								</label>
								<input
									type="text"
									placeholder="e.g., Birthmark on left arm"
									name="identificationMark"
									value={formData.identificationMark}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Student ID Document Number
								</label>
								<input
									type="text"
									placeholder="National Document ID"
									name="idCardNumber"
									value={formData.idCardNumber}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
								/>
							</div>
						</div>
					</section>

					{/* 2. ACADEMIC INFORMATION */}
					<section className="space-y-4">
						<h3 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2 flex items-center gap-2">
							<span>📚</span> Academic Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Class Applying For *
								</label>
								<input
									required
									type="text"
									name="classApplyingFor"
									value={formData.classApplyingFor}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Section Assign
								</label>
								<input
									type="text"
									name="section"
									value={formData.section}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Academic Session *
								</label>
								<input
									required
									type="text"
									placeholder="e.g., 2026-2027"
									name="academicSession"
									value={formData.academicSession}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Previous School Name
								</label>
								<input
									type="text"
									name="previousSchool"
									value={formData.previousSchool}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Previous Instruction Medium
								</label>
								<input
									type="text"
									name="previousMediumOfInstruction"
									value={formData.previousMediumOfInstruction}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Existing Board Reg Number
								</label>
								<input
									type="text"
									placeholder="If transferred from same board"
									name="boardRegistrationNumber"
									value={formData.boardRegistrationNumber}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
						</div>
					</section>

					{/* 3. FAMILY & CUSTODY DYNAMICS */}
					<section className="space-y-4">
						<h3 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2 flex items-center gap-2">
							<span>👨‍👩‍👧</span> Parents & Legal Custody Details
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Parents Marital Status
								</label>
								<select
									name="parentsMaritalStatus"
									value={formData.parentsMaritalStatus}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								>
									<option value="Married">Married</option>
									<option value="Single">Single</option>
									<option value="Divorced">Divorced</option>
									<option value="Widowed">Widowed</option>
								</select>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Legal Custody Records
								</label>
								<select
									name="legalCustodyHolder"
									value={formData.legalCustodyHolder}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								>
									<option value="Both">Both Parents</option>
									<option value="Father">Father Only</option>
									<option value="Mother">Mother Only</option>
									<option value="Guardian">
										Legal Guardian
									</option>
								</select>
							</div>

							{/* Father card */}
							<div className="space-y-3 p-4 bg-slate-50/70 rounded-xl border border-slate-100">
								<h4 className="font-semibold text-sm text-slate-700 mb-1">
									Father Information
								</h4>
								<input
									required
									type="text"
									placeholder="Father's Full Name *"
									name="fatherName"
									value={formData.fatherName}
									onChange={handleInputChange}
									className="block w-full rounded-md border-slate-200 text-sm p-2 border"
								/>
								<input
									required
									type="tel"
									placeholder="Mobile Number *"
									name="fatherMobile"
									value={formData.fatherMobile}
									onChange={handleInputChange}
									className="block w-full rounded-md border-slate-200 text-sm p-2 border"
								/>
								<input
									type="text"
									placeholder="Occupation"
									name="fatherOccupation"
									value={formData.fatherOccupation}
									onChange={handleInputChange}
									className="block w-full rounded-md border-slate-200 text-sm p-2 border"
								/>
								<input
									type="text"
									placeholder="Annual Income (Optional)"
									name="fatherIncome"
									value={formData.fatherIncome}
									onChange={handleInputChange}
									className="block w-full rounded-md border-slate-200 text-sm p-2 border"
								/>
							</div>

							{/* Mother card */}
							<div className="space-y-3 p-4 bg-slate-50/70 rounded-xl border border-slate-100">
								<h4 className="font-semibold text-sm text-slate-700 mb-1">
									Mother Information
								</h4>
								<input
									required
									type="text"
									placeholder="Mother's Full Name *"
									name="motherName"
									value={formData.motherName}
									onChange={handleInputChange}
									className="block w-full rounded-md border-slate-200 text-sm p-2 border"
								/>
								<input
									required
									type="tel"
									placeholder="Mobile Number *"
									name="motherMobile"
									value={formData.motherMobile}
									onChange={handleInputChange}
									className="block w-full rounded-md border-slate-200 text-sm p-2 border"
								/>
								<input
									type="text"
									placeholder="Occupation"
									name="motherOccupation"
									value={formData.motherOccupation}
									onChange={handleInputChange}
									className="block w-full rounded-md border-slate-200 text-sm p-2 border"
								/>
								<input
									type="email"
									placeholder="Email ID (Optional)"
									name="motherEmail"
									value={formData.motherEmail}
									onChange={handleInputChange}
									className="block w-full rounded-md border-slate-200 text-sm p-2 border"
								/>
							</div>

							{/* Siblings Tracker */}
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Any Siblings Studying Here?
								</label>
								<select
									name="siblingStudyingHere"
									value={formData.siblingStudyingHere}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								>
									<option value="No">No</option>
									<option value="Yes">Yes</option>
								</select>
							</div>
							{formData.siblingStudyingHere === "Yes" && (
								<div>
									<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
										Sibling Names & Grades
									</label>
									<input
										type="text"
										placeholder="e.g., Aarav Grade 4-B, Rohit Grade 9"
										name="siblingDetails"
										value={formData.siblingDetails}
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
									/>
								</div>
							)}
						</div>
					</section>

					{/* 4. ADDRESS INFORMATION */}
					<section className="space-y-4">
						<h3 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2 flex items-center gap-2">
							<span>🏠</span> Address Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
							<div className="md:col-span-2">
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Street / Locality *
								</label>
								<input
									required
									type="text"
									name="street"
									value={formData.street}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Village/City *
								</label>
								<input
									required
									type="text"
									name="city"
									value={formData.city}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									District *
								</label>
								<input
									required
									type="text"
									name="district"
									value={formData.district}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									State *
								</label>
								<input
									required
									type="text"
									name="state"
									value={formData.state}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Pincode *
								</label>
								<input
									required
									type="text"
									name="pincode"
									value={formData.pincode}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
						</div>
					</section>

					{/* 5. DETAILED MEDICAL PROFILE */}
					<section className="space-y-4">
						<h3 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2 flex items-center gap-2">
							<span>🚑</span> Medical & Safety Infrastructure
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Emergency Contact Name *
								</label>
								<input
									required
									type="text"
									name="emergencyContact"
									value={formData.emergencyContact}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Emergency Phone *
								</label>
								<input
									required
									type="tel"
									name="emergencyMobile"
									value={formData.emergencyMobile}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Relation with Student *
								</label>
								<input
									required
									type="text"
									placeholder="e.g., Uncle, Neighbor"
									name="emergencyRelation"
									value={formData.emergencyRelation}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Family Doctor's Name
								</label>
								<input
									type="text"
									name="familyDoctorName"
									value={formData.familyDoctorName}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Family Doctor Mobile
								</label>
								<input
									type="tel"
									name="familyDoctorMobile"
									value={formData.familyDoctorMobile}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Preferred Hospital
								</label>
								<input
									type="text"
									placeholder="In case of emergency transport"
									name="preferredHospital"
									value={formData.preferredHospital}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
							<div className="md:col-span-3">
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Known Medical Conditions or Allergies
								</label>
								<textarea
									rows="2"
									placeholder="List any chronic illness, asthma, or food/drug allergies clearly..."
									name="medicalConditions"
									value={formData.medicalConditions}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
								/>
							</div>
						</div>
					</section>

					{/* 6. EXPANDED FINANCIAL FEE MANAGEMENT */}
					<section className="space-y-4">
						<h3 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2 flex items-center gap-2">
							<span>💰</span> Fee Allocation & Payment Structures
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Fee Category *
								</label>
								<select
									name="feeCategory"
									value={formData.feeCategory}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 bg-white border"
								>
									<option value="General">
										Standard General
									</option>
									<option value="Staff Discount">
										Staff Concession
									</option>
									<option value="Sibling Discount">
										Sibling Concession
									</option>
									<option value="EWS">
										Economic Weaker Section (EWS)
									</option>
									<option value="Merit">
										Merit Scholarship
									</option>
								</select>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Scholarship Allocation?
								</label>
								<select
									name="scholarship"
									value={formData.scholarship}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 bg-white border"
								>
									<option value="No">No</option>
									<option value="Yes">Yes</option>
								</select>
							</div>
							<div className="md:col-span-2">
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Concession Reference Notes
								</label>
								<input
									type="text"
									placeholder="e.g., 20% sibling relief authorized by Principal"
									name="concessionDetails"
									value={formData.concessionDetails}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 bg-white border"
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Admission Fee Collected ($) *
								</label>
								<input
									required
									type="number"
									placeholder="0.00"
									name="admissionFeePaid"
									value={formData.admissionFeePaid}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 bg-white border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Security Deposit (Refundable)
								</label>
								<input
									type="number"
									placeholder="0.00"
									name="securityDepositPaid"
									value={formData.securityDepositPaid}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 bg-white border"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Tuition Invoice Cycle
								</label>
								<select
									name="tuitionFeeCycle"
									value={formData.tuitionFeeCycle}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 bg-white border"
								>
									<option value="Monthly">Monthly</option>
									<option value="Quarterly">Quarterly</option>
									<option value="Annually">Annually</option>
								</select>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Initial Payment Mode
								</label>
								<select
									name="paymentMode"
									value={formData.paymentMode}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 bg-white border"
								>
									<option value="Cash">Cash Ledger</option>
									<option value="Bank Transfer">
										Direct Bank Transfer
									</option>
									<option value="Card">
										Credit/Debit Card
									</option>
									<option value="Cheque">Bank Cheque</option>
								</select>
							</div>
						</div>
					</section>

					{/* 7. LEGAL ARCHIVE DOCUMENTS UPLOAD */}
					<section className="space-y-4">
						<h3 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2 flex items-center gap-2">
							<span>📄</span> Registry Document Repository
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-indigo-50/30 p-5 rounded-2xl border border-indigo-50">
							<div>
								<label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
									Student Passport Photo *
								</label>
								<input
									required
									type="file"
									name="studentPhoto"
									onChange={handleFileChange}
									className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
									Legal Birth Certificate *
								</label>
								<input
									required
									type="file"
									name="birthCertificate"
									onChange={handleFileChange}
									className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
									Student National ID Copy
								</label>
								<input
									type="file"
									name="studentIdCopy"
									onChange={handleFileChange}
									className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
									Previous Grade Transcripts
								</label>
								<input
									type="file"
									name="previousMarksheet"
									onChange={handleFileChange}
									className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
								/>
							</div>
						</div>
					</section>

					{/* SUBMIT BUTTON */}
					<div className="pt-4">
						<button
							type="submit"
							disabled={isLoading}
							className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{isLoading ? "Processing..." : "Complete Registration & Record Financial Transaction"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
