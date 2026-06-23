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
        aadhar: "", // Generic label for national identity cards
        abcId: "", // Optional ABC ID
        panNumber: "", // Optional PAN Number

        // 2. Academic Info
        classApplyingFor: "",
        section: "",
        previousSchool: "",
        previousClass: "",
        tcNumber: "",
        previousUdiseCode: "",
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

        // 6. Comprehensive Fee Information
        feeCategory: "General", // General, Staff Discount, Sibling Discount, EWS, Merit Scholarship
        scholarship: "No",
        concessionDetails: "",
        admissionFeePaid: "",
        tuitionFeeCycle: "Quarterly", // Monthly, Quarterly, Annually
        transportFeePaid: "",
        securityDepositPaid: "",
        paymentMode: "Cash", // Cash, Bank Transfer, Card, Cheque

        // 7. Bank Details (Optional)
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        branchNameAndCode: "",
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
                window.scrollTo({ top: 0, behavior: "smooth" });
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
                                    placeholder="e.g., Aarav"
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
                                    placeholder="e.g., Sharma"
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
                                    Religion
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Hindu, Muslim, Christian"
                                    name="religion"
                                    value={formData.religion}
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
                                    placeholder="e.g., Indian"
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
                            <div>
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
                                    National ID / Aadhar Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="[Aadhaar Redacted]"
                                    name="aadhar"
                                    value={formData.aadhar}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    ABC ID (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Academic Bank of Credits"
                                    name="abcId"
                                    value={formData.abcId}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    PAN Number (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Student PAN"
                                    name="panNumber"
                                    value={formData.panNumber}
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
                                    placeholder="e.g., Grade 10"
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
                                    placeholder="e.g., A"
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
                                    placeholder="e.g., Delhi Public School"
                                    value={formData.previousSchool}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Previous Class
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 5th Grade"
                                    name="previousClass"
                                    value={formData.previousClass}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    TC Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="Transfer Certificate No."
                                    name="tcNumber"
                                    value={formData.tcNumber}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Previous School UDISE Code
                                </label>
                                <input
                                    type="text"
                                    name="previousUdiseCode"
                                    placeholder="e.g., 09876543210"
                                    value={formData.previousUdiseCode}
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
                                    placeholder="e.g., English, Hindi"
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
                                <input
                                    type="email"
                                    placeholder="Email ID (Optional)"
                                    name="fatherEmail"
                                    value={formData.fatherEmail}
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
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    House / Flat No.
                                </label>
                                <input
                                    type="text"
                                    name="houseNo"
                                    placeholder="e.g., Flat 402, Block B"
                                    value={formData.houseNo}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Street / Locality *
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="street"
                                    placeholder="e.g., Main Market Road"
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
                                    placeholder="e.g., New Delhi"
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
                                    placeholder="e.g., South Delhi"
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
                                    placeholder="e.g., Delhi"
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
                                    placeholder="e.g., 110001"
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
                                    placeholder="Emergency Contact Name"
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
                                    placeholder="10-digit mobile number"
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
                                    placeholder="Dr. Full Name"
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
                                    placeholder="Doctor's Contact"
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
                                    Known Medical Conditions
                                </label>
                                <textarea
                                    rows="2"
                                    placeholder="List any chronic illness, asthma, etc."
                                    name="medicalConditions"
                                    value={formData.medicalConditions}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Specific Allergies
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Peanuts, Penicillin, Dust"
                                    name="allergies"
                                    value={formData.allergies}
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
                                    <option value="General">Standard General</option>
                                    <option value="Staff Discount">Staff Concession</option>
                                    <option value="Sibling Discount">Sibling Concession</option>
                                    <option value="EWS">Economic Weaker Section (EWS)</option>
                                    <option value="Merit">Merit Scholarship</option>
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
                                    Transport Fee Paid ($)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    name="transportFeePaid"
                                    value={formData.transportFeePaid}
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
                                    <option value="Bank Transfer">Direct Bank Transfer</option>
                                    <option value="Card">Credit/Debit Card</option>
                                    <option value="Cheque">Bank Cheque</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* 7. BANK DETAILS */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2 flex items-center gap-2">
                            <span>🏦</span> Bank Account Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Bank Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., State Bank of India"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Account Number (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Account Number"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    IFSC Code (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., SBIN0001234"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Branch Name & Code (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Downtown Branch - 01234"
                                    name="branchNameAndCode"
                                    value={formData.branchNameAndCode}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm text-sm p-2.5 border focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 8. LEGAL ARCHIVE DOCUMENTS UPLOAD */}
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