"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
	Building2,
	MapPin,
	User,
	CheckCircle2,
	ChevronRight,
	ChevronLeft,
	Loader2,
} from "lucide-react";

export default function RegistrationPage() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	// Form state precisely matching your backend API payload
	const [formData, setFormData] = useState({
		schoolName: "",
		subdomain: "",
		schoolType: "K-12",
		udiseCode: "",
		phone: "",
		schoolEmail: "",
		address: "",
		city: "",
		district: "",
		state: "",
		pincode: "",
		adminName: "",
		adminEmail: "",
		adminPassword: "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleNext = () => setStep((prev) => prev + 1);
	const handleBack = () => setStep((prev) => prev - 1);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			const response = await fetch("/api/school/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Registration failed");
			}

			setSuccess(true);
			// Wait for 2 seconds to show success animation, then redirect to login
			setTimeout(() => router.push("/auth/login"), 2000);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
				{/* Header & Stepper */}
				<div className="bg-blue-600 px-8 py-6 text-white">
					<h2 className="text-3xl font-extrabold tracking-tight">
						Join School Grid
					</h2>
					<p className="mt-2 text-blue-100">
						Digitize your school operations in minutes.
					</p>

					<div className="mt-8 flex items-center justify-between relative">
						<div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-blue-400 rounded"></div>
						<div
							className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white rounded transition-all duration-500"
							style={{ width: `${((step - 1) / 2) * 100}%` }}
						></div>

						{[1, 2, 3].map((num) => (
							<div
								key={num}
								className={`relative flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors duration-300 ${step >= num ? "bg-white text-blue-600 shadow-md" : "bg-blue-400 text-blue-100"}`}
							>
								{num === 1 && <Building2 size={20} />}
								{num === 2 && <MapPin size={20} />}
								{num === 3 && <User size={20} />}
							</div>
						))}
					</div>
				</div>

				{/* Form Area */}
				<div className="px-8 py-10 relative overflow-hidden min-h-[400px]">
					{error && (
						<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
							{error}
						</div>
					)}

					{success ? (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="flex flex-col items-center justify-center h-full text-center py-10"
						>
							<CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
							<h3 className="text-2xl font-bold text-gray-900">
								Registration Successful!
							</h3>
							<p className="text-gray-500 mt-2">
								Redirecting you to the login page...
							</p>
						</motion.div>
					) : (
						<AnimatePresence mode="wait">
							<motion.div
								key={step}
								initial={{ x: 50, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: -50, opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								<form
									onSubmit={
										step === 3
											? handleSubmit
											: (e) => {
													e.preventDefault();
													handleNext();
												}
									}
								>
									{/* STEP 1: School Details */}
									{step === 1 && (
										<div className="space-y-5">
											<div>
												<label className="block text-sm font-medium text-gray-700">
													School Name
												</label>
												<input
													type="text"
													required
													name="schoolName"
													value={formData.schoolName}
													onChange={handleChange}
													className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
													placeholder="Delhi Public School"
												/>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
												<div>
													<label className="block text-sm font-medium text-gray-700">
														Subdomain (Unique)
													</label>
													<input
														type="text"
														required
														name="subdomain"
														value={
															formData.subdomain
														}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
														placeholder="dps-delhi"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700">
														UDISE Code
													</label>
													<input
														type="text"
														required
														name="udiseCode"
														value={
															formData.udiseCode
														}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
														placeholder="09123456789"
													/>
												</div>
											</div>
										</div>
									)}

									{/* STEP 2: Address & Contact */}
									{step === 2 && (
										<div className="space-y-5">
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
												<div>
													<label className="block text-sm font-medium text-gray-700">
														School Email
													</label>
													<input
														type="email"
														required
														name="schoolEmail"
														value={
															formData.schoolEmail
														}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
														placeholder="info@school.com"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700">
														Phone Number
													</label>
													<input
														type="text"
														required
														name="phone"
														value={formData.phone}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
														placeholder="+91 9876543210"
													/>
												</div>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Complete Address
												</label>
												<input
													type="text"
													required
													name="address"
													value={formData.address}
													onChange={handleChange}
													className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													placeholder="Sector 14, Main Road"
												/>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
												<div>
													<label className="block text-sm font-medium text-gray-700">
														City
													</label>
													<input
														type="text"
														required
														name="city"
														value={formData.city}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700">
														State
													</label>
													<input
														type="text"
														required
														name="state"
														value={formData.state}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700">
														Pincode
													</label>
													<input
														type="text"
														required
														name="pincode"
														value={formData.pincode}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													/>
												</div>
											</div>
										</div>
									)}

									{/* STEP 3: Admin Setup */}
									{step === 3 && (
										<div className="space-y-5">
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Admin/Principal Name
												</label>
												<input
													type="text"
													required
													name="adminName"
													value={formData.adminName}
													onChange={handleChange}
													className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													placeholder="Dr. Sharma"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Admin Login Email
												</label>
												<input
													type="email"
													required
													name="adminEmail"
													value={formData.adminEmail}
													onChange={handleChange}
													className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													placeholder="admin@school.com"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Secure Password
												</label>
												<input
													type="password"
													required
													name="adminPassword"
													value={
														formData.adminPassword
													}
													onChange={handleChange}
													className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													placeholder="••••••••"
												/>
											</div>
										</div>
									)}

									{/* Navigation Buttons */}
									<div className="mt-10 flex justify-between">
										{step > 1 ? (
											<button
												type="button"
												onClick={handleBack}
												className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
											>
												<ChevronLeft className="w-4 h-4 mr-1" />{" "}
												Back
											</button>
										) : (
											<div></div>
										)}

										<button
											type="submit"
											disabled={isSubmitting}
											className="flex items-center px-8 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:bg-blue-400"
										>
											{step === 3 ? (
												isSubmitting ? (
													<>
														<Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
														Registering...
													</>
												) : (
													"Complete Registration"
												)
											) : (
												<>
													Next Step{" "}
													<ChevronRight className="w-4 h-4 ml-1" />
												</>
											)}
										</button>
									</div>
								</form>
							</motion.div>
						</AnimatePresence>
					)}
				</div>
			</div>
		</div>
	);
}
