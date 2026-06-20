"use client";
import React, { useState, useEffect } from "react";

const IssueTransferCertificate = () => {
	const [tcNumber, setTcNumber] = useState("");
	const [issueDate, setIssueDate] = useState("");

	useEffect(() => {
		// Client-side par hi TC aur Date generate honge
		setTcNumber(
			`TC-${new Date().getFullYear()}-${Math.floor(
				1000 + Math.random() * 9000,
			)}`,
		);
		// Hydration error se bachne ke liye date yahan set karein
		setIssueDate(
			new Date().toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}),
		);
	}, []);

	const [studentInfo, setStudentInfo] = useState({
		tcNumber: tcNumber,
		studentName: "",
		admissionNumber: "",
		dateOfBirth: "",
		parentName: "",
		leavingDate: "",
		academicStatus: "Passed & Promoted",
		reasonForLeaving: "",
		conduct: "Good",
	});

	const [isSaved, setIsSaved] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setStudentInfo((prev) => ({ ...prev, [name]: value }));
	};

	const handleSaveToDatabase = (e) => {
		e.preventDefault();
		console.log("Saving student TC data to database...", studentInfo);
		setIsSaved(true);
	};

	const handleDownloadPDF = () => {
		window.print();
	};

	return (
		<div className="min-h-screen w-full bg-gray-50 font-sans p-4 sm:p-6">
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* LEFT COLUMN: Input Form */}
				<div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:hidden">
					<h2 className="text-xl font-bold text-gray-800 mb-5">
						Student Information Entry
					</h2>

					<form onSubmit={handleSaveToDatabase} className="space-y-4">
						<div>
							<label className="block text-xs font-bold text-gray-600 uppercase mb-1">
								Student Full Name
							</label>
							<input
								type="text"
								name="studentName"
								required
								value={studentInfo.studentName}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
								placeholder="e.g. Alex Smith"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-bold text-gray-600 uppercase mb-1">
									Admission / ID No.
								</label>
								<input
									type="text"
									name="admissionNumber"
									required
									value={studentInfo.admissionNumber}
									onChange={handleInputChange}
									className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
									placeholder="e.g. 2026-89A"
								/>
							</div>
							<div>
								<label className="block text-xs font-bold text-gray-600 uppercase mb-1">
									Date of Birth
								</label>
								<input
									type="date"
									name="dateOfBirth"
									required
									value={studentInfo.dateOfBirth}
									onChange={handleInputChange}
									className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-bold text-gray-600 uppercase mb-1">
								Parent / Guardian Name
							</label>
							<input
								type="text"
								name="parentName"
								required
								value={studentInfo.parentName}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
								placeholder="e.g. Robert Smith"
							/>
						</div>

						<div>
							<label className="block text-xs font-bold text-gray-600 uppercase mb-1">
								Date of Leaving
							</label>
							<input
								type="date"
								name="leavingDate"
								required
								value={studentInfo.leavingDate}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
							/>
						</div>

						<div>
							<label className="block text-xs font-bold text-gray-600 uppercase mb-1">
								Reason for Leaving
							</label>
							<input
								type="text"
								name="reasonForLeaving"
								required
								value={studentInfo.reasonForLeaving}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
								placeholder="e.g. Relocation of family"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-bold text-gray-600 uppercase mb-1">
									Academic Status
								</label>
								<select
									name="academicStatus"
									value={studentInfo.academicStatus}
									onChange={handleInputChange}
									className="w-full p-2 bg-white border border-gray-300 rounded text-sm"
								>
									<option value="Passed & Promoted">
										Passed & Promoted
									</option>
									<option value="Studying in Class">
										Studying in Class
									</option>
									<option value="Withdrawn Prematurely">
										Withdrawn Prematurely
									</option>
								</select>
							</div>
							<div>
								<label className="block text-xs font-bold text-gray-600 uppercase mb-1">
									Conduct
								</label>
								<select
									name="conduct"
									value={studentInfo.conduct}
									onChange={handleInputChange}
									className="w-full p-2 bg-white border border-gray-300 rounded text-sm"
								>
									<option value="Good">Good</option>
									<option value="Exemplary">Exemplary</option>
									<option value="Satisfactory">
										Satisfactory
									</option>
								</select>
							</div>
						</div>

						<button
							type="submit"
							className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 font-medium rounded transition text-sm shadow-sm"
						>
							Save Certificate Records
						</button>
					</form>
				</div>

				{/* RIGHT COLUMN: Official Preview Certificate Document */}
				<div className="lg:col-span-7 flex flex-col justify-start print:w-full print:p-0">
					{/* Action Download Header Banner */}
					<div className="w-full mb-4 flex items-center justify-between bg-slate-800 text-white p-3 rounded-lg shadow-sm print:hidden">
						<span className="text-sm font-medium">
							{isSaved
								? "✅ Records verified & synced"
								: "⚠️ Draft Mode: Click save to verify"}
						</span>
						<button
							onClick={handleDownloadPDF}
							disabled={!isSaved}
							className={`px-4 py-1.5 rounded text-xs font-bold shadow transition ${
								isSaved
									? "bg-emerald-500 hover:bg-emerald-600 text-white"
									: "bg-gray-600 text-gray-400 cursor-not-allowed"
							}`}
						>
							Download / Print PDF
						</button>
					</div>

					{/* 📱 RESPONSIVE A4 LAYOUT (No scroll, perfectly scaled) */}
					<div className="w-full bg-white p-4 sm:p-6 md:p-10 border-4 sm:border-8 border-double border-slate-700 shadow-md rounded-sm aspect-[1/1.414] flex flex-col print:border-none print:shadow-none print:p-0 print:m-0 print:aspect-auto print:h-auto">
						{/* Header School Information */}
						<div className="text-center border-b-2 border-slate-800 pb-2 md:pb-4 mb-3 md:mb-6">
							<h1 className="text-sm sm:text-lg md:text-2xl font-black uppercase tracking-wider text-slate-800">
								Excel International Academy
							</h1>
							<p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 tracking-tight">
								Main Campus, Administrative Zone, City District
							</p>
							<h3 className="inline-block mt-2 md:mt-4 px-3 sm:px-4 md:px-6 py-0.5 md:py-1 bg-slate-800 text-white text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-sm">
								Transfer Certificate
							</h3>
						</div>

						{/* Certificate Meta Details */}
						<div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs font-bold text-slate-700 mb-3 md:mb-8">
							<span>
								TC Log Ref:{" "}
								<span className="underline font-mono">
									{tcNumber}
								</span>
							</span>
							<span>
								Date Issued:{" "}
								<span className="underline">{issueDate}</span>
							</span>
						</div>

						{/* Document Statement Structure */}
						<div className="space-y-2 sm:space-y-3 md:space-y-5 text-[9px] sm:text-[11px] md:text-sm text-slate-800 leading-relaxed text-justify flex-1">
							<p>
								This is to formally certify that{" "}
								<span className="font-bold border-b border-gray-400 px-1 sm:px-2 min-w-[100px] sm:min-w-[180px] inline-block text-center">
									{studentInfo.studentName ||
										"________________"}
								</span>
							</p>

							<p>
								Son/Daughter of Honorable Parent/Guardian{" "}
								<span className="font-bold border-b border-gray-400 px-1 sm:px-2 min-w-[120px] sm:min-w-[200px] inline-block text-center">
									{studentInfo.parentName ||
										"________________"}
								</span>
							</p>

							<p>
								was registered at this academy under Admission
								File Code Reference Number{" "}
								<span className="font-mono font-bold border-b border-gray-400 px-1 sm:px-2 text-center">
									{studentInfo.admissionNumber || "________"}
								</span>
								.
							</p>

							<p>
								According to official school registration
								archives, the student's recorded Date of Birth
								corresponds to{" "}
								<span className="font-bold border-b border-gray-400 px-1 sm:px-2 text-center">
									{studentInfo.dateOfBirth || "________"}
								</span>
								.
							</p>

							<p>
								The student has officially separated from the
								academic institution on the effective date of{" "}
								<span className="font-bold border-b border-gray-400 px-1 sm:px-2 text-center">
									{studentInfo.leavingDate || "________"}
								</span>{" "}
								due to the following specific reason:{" "}
								<span className="italic font-medium border-b border-gray-400 px-1">
									{studentInfo.reasonForLeaving ||
										"________________"}
								</span>
								.
							</p>

							<p>
								At the date of separation, the recorded formal
								academic standing is cataloged as{" "}
								<span className="font-bold text-blue-900">
									{studentInfo.academicStatus}
								</span>{" "}
								with a general behavioral conduct rating of{" "}
								<span className="font-bold text-emerald-800">
									{studentInfo.conduct}
								</span>
								.
							</p>
						</div>

						{/* Signature Area (Always pushed to bottom) */}
						<div className="mt-auto pt-4 md:pt-8 flex justify-between items-end text-[8px] sm:text-[10px] md:text-xs font-bold text-slate-700">
							<div className="text-center">
								<div className="w-16 sm:w-24 md:w-32 border-t border-slate-600 mb-1"></div>
								<span>Registrar Desk</span>
							</div>
							<div className="text-center">
								<div className="w-16 sm:w-24 md:w-32 border-t border-slate-600 mb-1"></div>
								<span>Principal Endorsement</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default IssueTransferCertificate;
