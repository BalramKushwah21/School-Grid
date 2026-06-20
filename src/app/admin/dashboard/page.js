"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
	Users,
	UserCheck,
	Users2,
	School,
	CalendarCheck,
	Wallet,
	FileText,
	Target,
	Plus,
	BellRing,
	Sparkles,
	TrendingUp,
	AlertTriangle,
	Clock,
	Bus,
	BookOpen,
	Gift,
	Award,
	MoreVertical,
	ArrowUpRight,
} from "lucide-react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	AreaChart,
	Area,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";

export default function PrincipalDashboard() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

  const links = [
		{
			label: "Admission",
			icon: Plus,
			bg: "bg-blue-500",
			link: "/admin/pages/students/admission",
		},
		{
			label: "Teacher",
			icon: UserCheck,
			bg: "bg-indigo-500",
			link: "/admin/pages/teachers/list",
		},
		{
			label: "Fee",
			icon: Wallet,
			bg: "bg-emerald-500",
		},
		{
			label: "Notice",
			icon: BellRing,
			bg: "bg-amber-500",
		},
		{
			label: "Exam",
			icon: FileText,
			bg: "bg-rose-500",
		},
		{
			label: "Report",
			icon: TrendingUp,
			bg: "bg-purple-500",
		},
  ];


	const [data, setData] = useState({
		welcome: {
			principalName: "Alex",
			academicYear: "2026-27",
			date: "Thursday, 18 June 2026",
			pendingApprovals: 3,
			urgentNotices: 2,
			newAdmissions: 5,
		},
		kpis: [
			{
				title: "Total Students",
				value: "2,450",
				icon: Users,
				color: "text-blue-600",
				bg: "bg-blue-50",
			},
			{
				title: "Total Teachers",
				value: "142",
				icon: UserCheck,
				color: "text-indigo-600",
				bg: "bg-indigo-50",
			},
			{
				title: "Total Parents",
				value: "3,890",
				icon: Users2,
				color: "text-purple-600",
				bg: "bg-purple-50",
			},
			{
				title: "Total Classes",
				value: "48",
				icon: School,
				color: "text-cyan-600",
				bg: "bg-cyan-50",
			},
			{
				title: "Today's Attendance",
				value: "94.2%",
				icon: CalendarCheck,
				color: "text-emerald-600",
				bg: "bg-emerald-50",
			},
			{
				title: "Fee Collection",
				value: "82%",
				icon: Wallet,
				color: "text-amber-600",
				bg: "bg-amber-50",
			},
			{
				title: "Pending Admissions",
				value: "18",
				icon: FileText,
				color: "text-rose-600",
				bg: "bg-rose-50",
			},
			{
				title: "Upcoming Exams",
				value: "3",
				icon: Target,
				color: "text-fuchsia-600",
				bg: "bg-fuchsia-50",
			},
		],
    

		charts: {
			studentsByClass: [
				{ name: "Class 8", students: 240 },
				{ name: "Class 9", students: 310 },
				{ name: "Class 10", students: 380 },
				{ name: "Class 11", students: 290 },
				{ name: "Class 12", students: 260 },
			],
			attendanceTrend: [
				{ day: "Mon", perc: 94 },
				{ day: "Tue", perc: 96 },
				{ day: "Wed", perc: 95 },
				{ day: "Thu", perc: 92 },
				{ day: "Fri", perc: 97 },
			],
			revenue: [
				{ month: "Jan", collected: 12 },
				{ month: "Feb", collected: 15 },
				{ month: "Mar", collected: 18 },
				{ month: "Apr", collected: 22 },
				{ month: "May", collected: 16 },
				{ month: "Jun", collected: 15 },
			],
			gender: [
				{ name: "Male", value: 55, color: "#3b82f6" },
				{ name: "Female", value: 45, color: "#ec4899" },
			],
		},
		attendanceDonuts: {
			students: [
				{ name: "Present", value: 2450, color: "#10b981" },
				{ name: "Absent", value: 95, color: "#f1f5f9" },
			],
			teachers: [
				{ name: "Present", value: 140, color: "#6366f1" },
				{ name: "Absent", value: 2, color: "#f1f5f9" },
			],
			staff: [
				{ name: "Present", value: 32, color: "#f59e0b" },
				{ name: "Absent", value: 1, color: "#f1f5f9" },
			],
		},
		finance: {
			collected: "₹15L",
			pending: "₹4L",
			expenses: "₹8L",
			profit: "₹7L",
			totalDue: "₹19L",
		},
		aiInsights: [
			{
				msg: "15 Students have critically low attendance (< 75%)",
				type: "danger",
			},
			{
				msg: "8 Students in Class 10-A may fail Mathematics",
				type: "warning",
			},
			{
				msg: "12 Fee accounts are overdue for 60+ days",
				type: "warning",
			},
			{
				msg: "Class 9-B attendance dropped by 7% this week",
				type: "danger",
			},
		],
		activityFeed: [
			{
				time: "10:30 AM",
				title: "Student Admission Added",
				desc: "Rahul Kumar, Class 6",
			},
			{
				time: "11:15 AM",
				title: "Teacher Attendance Marked",
				desc: "140/142 Present",
			},
			{
				time: "12:10 PM",
				title: "Fee Received ₹15,000",
				desc: "Via Online Gateway",
			},
			{
				time: "12:45 PM",
				title: "Exam Schedule Published",
				desc: "Mid-Terms 2026",
			},
		],
	});

	const containerVariants = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { staggerChildren: 0.1 } },
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 300, damping: 24 },
		},
	};

	if (!isMounted) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50  font-sans text-slate-800">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="show"
				className="max-w-[1600px] mx-auto space-y-8"
			>
				{/* ==========================================
            SECTION 1: HERO BANNER 
        ========================================== */}
				<motion.div
					variants={itemVariants}
					className="bg-[#0b1120] rounded-[2rem] py-8 px-2 md:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-8 border border-slate-800 group"
				>
					<div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[80px] group-hover:bg-blue-500/40 transition-colors duration-700"></div>
					<div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-purple-600/30 rounded-full blur-[80px] group-hover:bg-purple-500/40 transition-colors duration-700"></div>

					<div className="relative z-10">
						<h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 drop-shadow-md">
							Good Morning, {data.welcome.principalName}! 🌅
						</h1>
						<div className="flex flex-wrap items-center gap-3 text-sm font-medium">
							<span className="bg-white/10 text-blue-200 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
								Academic Year: {data.welcome.academicYear}
							</span>
							<span className="bg-white/10 text-slate-200 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
								{data.welcome.date}
							</span>
						</div>
					</div>

					<div className="relative z-10 flex gap-4 md:gap-6 overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
						{[
							{
								label: "Approvals",
								value: data.welcome.pendingApprovals,
								color: "text-amber-400",
								glow: "shadow-amber-500/20",
							},
							{
								label: "Urgent",
								value: data.welcome.urgentNotices,
								color: "text-rose-400",
								glow: "shadow-rose-500/20",
							},
							{
								label: "Admissions",
								value: data.welcome.newAdmissions,
								color: "text-emerald-400",
								glow: "shadow-emerald-500/20",
							},
						].map((stat, i) => (
							<motion.div
								whileHover={{ y: -5, scale: 1.02 }}
								key={i}
								className={`bg-white/5 border border-white/10 rounded-3xl p-5 min-w-[130px] text-center backdrop-blur-xl shadow-lg ${stat.glow} cursor-pointer transition-all`}
							>
								<p
									className={`text-4xl font-black ${stat.color} drop-shadow-sm`}
								>
									{stat.value}
								</p>
								<p className="text-xs text-slate-300 uppercase tracking-widest font-bold mt-2">
									{stat.label}
								</p>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* ==========================================
            SECTION 2: QUICK ACTIONS 
        ========================================== */}
				<motion.div variants={itemVariants}>
					<h3 className="text-xl font-extrabold text-slate-800 tracking-tight mb-4">
						Quick Actions
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{links.map((action, idx) => (
                <Link href={`${action.link}`}
                key={idx}
                className={`${action.bg} text-white p-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-3 relative overflow-hidden group hover:scale-105 hover:scale-x-95 hover:tab-2`  }
                >
							
									<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
									<action.icon className="w-7 h-7 relative z-10 drop-shadow-md" />
									<span className="font-bold text-sm tracking-wide relative z-10">
										{action.label}
									</span>
							</Link>
								
						))}
					</div>
				</motion.div>

				{/* ==========================================
            SECTION 3: KPI CARDS (8 Cards)
        ========================================== */}
				<motion.div
					variants={itemVariants}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
				>
					{data.kpis.map((kpi, idx) => (
						<motion.div
							whileHover={{ y: -5 }}
							key={idx}
							className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-lg transition-all group flex items-center justify-between"
						>
							<div>
								<p className="text-sm font-bold text-slate-500 mb-1">
									{kpi.title}
								</p>
								<h3 className="text-3xl font-black text-slate-800 tracking-tight">
									{kpi.value}
								</h3>
							</div>
							<div
								className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color} group-hover:rotate-12 transition-transform duration-300`}
							>
								<kpi.icon className="w-7 h-7" />
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* ==========================================
            SECTION 4: CHARTS ROW (ALL 4 Charts)
        ========================================== */}
				<motion.div
					variants={itemVariants}
					className="grid grid-cols-1 lg:grid-cols-2 gap-6"
				>
					{/* Chart 1: Students */}
					<div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-lg transition-shadow">
						<h3 className="text-lg font-extrabold text-slate-800 mb-6">
							Students by Class
						</h3>
						<div className="h-72">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={data.charts.studentsByClass}
									margin={{
										top: 10,
										right: 10,
										left: -20,
										bottom: 0,
									}}
								>
									<CartesianGrid
										strokeDasharray="3 3"
										vertical={false}
										stroke="#e2e8f0"
									/>
									<XAxis
										dataKey="name"
										axisLine={false}
										tickLine={false}
										tick={{
											fill: "#64748b",
											fontSize: 12,
											fontWeight: 600,
										}}
										dy={10}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{
											fill: "#64748b",
											fontSize: 12,
											fontWeight: 600,
										}}
									/>
									<Tooltip
										cursor={{
											fill: "rgba(59, 130, 246, 0.05)",
										}}
										contentStyle={{
											borderRadius: "16px",
											border: "none",
											boxShadow:
												"0 10px 25px -5px rgb(0 0 0 / 0.1)",
										}}
									/>
									<Bar
										dataKey="students"
										fill="#3b82f6"
										radius={[6, 6, 6, 6]}
										barSize={28}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Chart 2: Attendance Trend */}
					<div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-lg transition-shadow">
						<h3 className="text-lg font-extrabold text-slate-800 mb-6">
							Last 30 Days Attendance %
						</h3>
						<div className="h-72">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart
									data={data.charts.attendanceTrend}
									margin={{
										top: 10,
										right: 10,
										left: -20,
										bottom: 0,
									}}
								>
									<CartesianGrid
										strokeDasharray="3 3"
										vertical={false}
										stroke="#e2e8f0"
									/>
									<XAxis
										dataKey="day"
										axisLine={false}
										tickLine={false}
										tick={{
											fill: "#64748b",
											fontSize: 12,
											fontWeight: 600,
										}}
										dy={10}
									/>
									<YAxis
										domain={["auto", "auto"]}
										axisLine={false}
										tickLine={false}
										tick={{
											fill: "#64748b",
											fontSize: 12,
											fontWeight: 600,
										}}
									/>
									<Tooltip
										contentStyle={{
											borderRadius: "16px",
											border: "none",
											boxShadow:
												"0 10px 25px -5px rgb(0 0 0 / 0.1)",
										}}
									/>
									<Line
										type="monotone"
										dataKey="perc"
										stroke="#10b981"
										strokeWidth={4}
										dot={{
											r: 5,
											fill: "#10b981",
											strokeWidth: 2,
											stroke: "#fff",
										}}
										activeDot={{ r: 8 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Chart 3: Gender Distribution */}
					<div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
						<h3 className="text-lg font-extrabold text-slate-800 mb-2">
							Gender Distribution
						</h3>
						<div className="h-72 flex-1">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={data.charts.gender}
										cx="50%"
										cy="50%"
										innerRadius={70}
										outerRadius={100}
										paddingAngle={5}
										dataKey="value"
										stroke="none"
									>
										{data.charts.gender.map(
											(entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={entry.color}
												/>
											),
										)}
									</Pie>
									<Tooltip
										contentStyle={{
											borderRadius: "16px",
											border: "none",
											boxShadow:
												"0 10px 25px -5px rgb(0 0 0 / 0.1)",
										}}
									/>
									<Legend
										verticalAlign="bottom"
										height={36}
										iconType="circle"
										wrapperStyle={{
											fontWeight: 600,
											fontSize: "13px",
											color: "#475569",
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Chart 4: Monthly Revenue */}
					<div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-lg transition-shadow">
						<h3 className="text-lg font-extrabold text-slate-800 mb-6">
							Revenue Analytics
						</h3>
						<div className="h-72">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={data.charts.revenue}
									margin={{
										top: 10,
										right: 10,
										left: -20,
										bottom: 0,
									}}
								>
									<defs>
										<linearGradient
											id="colorRev"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="5%"
												stopColor="#f59e0b"
												stopOpacity={0.3}
											/>
											<stop
												offset="95%"
												stopColor="#f59e0b"
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray="3 3"
										vertical={false}
										stroke="#e2e8f0"
									/>
									<XAxis
										dataKey="month"
										axisLine={false}
										tickLine={false}
										tick={{
											fill: "#64748b",
											fontSize: 12,
											fontWeight: 600,
										}}
										dy={10}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{
											fill: "#64748b",
											fontSize: 12,
											fontWeight: 600,
										}}
									/>
									<Tooltip
										contentStyle={{
											borderRadius: "16px",
											border: "none",
											boxShadow:
												"0 10px 25px -5px rgb(0 0 0 / 0.1)",
										}}
									/>
									<Area
										type="monotone"
										dataKey="collected"
										stroke="#f59e0b"
										strokeWidth={4}
										fillOpacity={1}
										fill="url(#colorRev)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>
				</motion.div>

				{/* ==========================================
            SECTION 5: MASONRY GRID LAYOUT
        ========================================== */}
				<motion.div
					variants={itemVariants}
					className="grid grid-cols-1 xl:grid-cols-3 gap-8"
				>
					{/* LEFT COLUMN */}
					<div className="space-y-8 xl:col-span-2">
						{/* AI Insights Widget */}
						<div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1 rounded-[2rem] shadow-xl">
							<div className="bg-white/95 backdrop-blur-xl rounded-[1.8rem] p-6 h-full">
								<h3 className="text-xl font-extrabold mb-5 flex items-center gap-2 text-slate-800 tracking-tight">
									<Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-100" />{" "}
									AI Executive Insights
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{data.aiInsights.map((insight, idx) => (
										<motion.div
											whileHover={{ scale: 1.02 }}
											key={idx}
											className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-default ${insight.type === "danger" ? "bg-rose-50/50 border-rose-100 text-rose-800" : "bg-amber-50/50 border-amber-100 text-amber-800"}`}
										>
											<AlertTriangle
												className={`w-5 h-5 shrink-0 mt-0.5 ${insight.type === "danger" ? "text-rose-500" : "text-amber-500"}`}
											/>
											<p className="text-sm font-bold leading-snug">
												{insight.msg}
											</p>
										</motion.div>
									))}
								</div>
							</div>
						</div>

						{/* Financial Overview Widget */}
						<div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-sm">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
									Financial Overview
								</h3>
								<button className="text-sm text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
									View Ledger
								</button>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
								{[
									{
										label: "Collected",
										value: data.finance.collected,
										color: "text-emerald-600",
									},
									{
										label: "Pending",
										value: data.finance.pending,
										color: "text-rose-600",
									},
									{
										label: "Expenses",
										value: data.finance.expenses,
										color: "text-amber-600",
									},
									{
										label: "Profit",
										value: data.finance.profit,
										color: "text-blue-600",
									},
								].map((fin, i) => (
									<div
										key={i}
										className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow"
									>
										<p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-2">
											{fin.label}
										</p>
										<p
											className={`text-3xl font-black ${fin.color}`}
										>
											{fin.value}
										</p>
									</div>
								))}
							</div>
							<div className="w-full bg-slate-100 rounded-full h-4 flex overflow-hidden shadow-inner">
								<div
									className="bg-emerald-500 h-4 transition-all duration-1000"
									style={{ width: "65%" }}
								></div>
								<div
									className="bg-rose-500 h-4 transition-all duration-1000"
									style={{ width: "20%" }}
								></div>
								<div
									className="bg-amber-500 h-4 transition-all duration-1000"
									style={{ width: "15%" }}
								></div>
							</div>
						</div>

						{/* Pending Approvals & Top Performers */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Pending Approvals */}
							<div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-lg transition-shadow">
								<h3 className="text-xl font-extrabold mb-5 text-slate-800 tracking-tight">
									Pending Approvals
								</h3>
								<div className="space-y-3">
									{[
										"Pending Admissions (5)",
										"Leave Requests (8)",
										"Fee Discounts (3)",
										"Teacher Approvals (2)",
									].map((item, i) => (
										<div
											key={i}
											className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
										>
											<span className="font-bold text-slate-700 text-sm">
												{item}
											</span>
											<button className="text-xs bg-blue-50 text-blue-600 font-black px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors">
												Review
											</button>
										</div>
									))}
								</div>
							</div>

							{/* Top Performers */}
							<div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-lg transition-shadow">
								<h3 className="text-xl font-extrabold mb-5 text-slate-800 tracking-tight">
									Top Performers
								</h3>
								<div className="space-y-5">
									<div>
										<p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
											Students
										</p>
										<div className="space-y-2">
											<p className="text-sm font-bold text-slate-700 flex items-center gap-2">
												<Award className="w-5 h-5 text-amber-500" />{" "}
												1. Rahul Sharma
											</p>
											<p className="text-sm font-bold text-slate-700 flex items-center gap-2">
												<Award className="w-5 h-5 text-slate-400" />{" "}
												2. Priya Patel
											</p>
											<p className="text-sm font-bold text-slate-700 flex items-center gap-2">
												<Award className="w-5 h-5 text-amber-700" />{" "}
												3. Aman Verma
											</p>
										</div>
									</div>
									<div className="border-t border-slate-100 pt-4">
										<p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
											Teachers
										</p>
										<p className="text-sm font-bold text-slate-700 flex items-center gap-2">
											1. Mr. Gupta • 2. Ms. Sharma
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* RIGHT COLUMN */}
					<div className="space-y-8">
						{/* Today's Attendance Donuts */}
						<div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-lg transition-shadow">
							<h3 className="text-xl font-extrabold mb-5 text-slate-800 tracking-tight">
								Today's Attendance
							</h3>
							<div className="grid grid-cols-3 gap-2 text-center">
								<div>
									<div className="h-28">
										<ResponsiveContainer
											width="100%"
											height="100%"
										>
											<PieChart>
												<Pie
													data={
														data.attendanceDonuts
															.students
													}
													cx="50%"
													cy="50%"
													innerRadius={28}
													outerRadius={40}
													dataKey="value"
													stroke="none"
												>
													{data.attendanceDonuts.students.map(
														(entry, index) => (
															<Cell
																key={`cell-${index}`}
																fill={
																	entry.color
																}
															/>
														),
													)}
												</Pie>
											</PieChart>
										</ResponsiveContainer>
									</div>
									<p className="text-sm font-extrabold text-slate-800 -mt-2">
										Students
									</p>
									<p className="text-[11px] font-bold text-slate-500 mt-0.5">
										2,450 / 95
									</p>
								</div>
								<div>
									<div className="h-28">
										<ResponsiveContainer
											width="100%"
											height="100%"
										>
											<PieChart>
												<Pie
													data={
														data.attendanceDonuts
															.teachers
													}
													cx="50%"
													cy="50%"
													innerRadius={28}
													outerRadius={40}
													dataKey="value"
													stroke="none"
												>
													{data.attendanceDonuts.teachers.map(
														(entry, index) => (
															<Cell
																key={`cell-${index}`}
																fill={
																	entry.color
																}
															/>
														),
													)}
												</Pie>
											</PieChart>
										</ResponsiveContainer>
									</div>
									<p className="text-sm font-extrabold text-slate-800 -mt-2">
										Teachers
									</p>
									<p className="text-[11px] font-bold text-slate-500 mt-0.5">
										140 / 2
									</p>
								</div>
								<div>
									<div className="h-28">
										<ResponsiveContainer
											width="100%"
											height="100%"
										>
											<PieChart>
												<Pie
													data={
														data.attendanceDonuts
															.staff
													}
													cx="50%"
													cy="50%"
													innerRadius={28}
													outerRadius={40}
													dataKey="value"
													stroke="none"
												>
													{data.attendanceDonuts.staff.map(
														(entry, index) => (
															<Cell
																key={`cell-${index}`}
																fill={
																	entry.color
																}
															/>
														),
													)}
												</Pie>
											</PieChart>
										</ResponsiveContainer>
									</div>
									<p className="text-sm font-extrabold text-slate-800 -mt-2">
										Staff
									</p>
									<p className="text-[11px] font-bold text-slate-500 mt-0.5">
										32 / 1
									</p>
								</div>
							</div>
						</div>

						{/* Live Timeline */}
						<div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-lg transition-shadow">
							<h3 className="text-xl font-extrabold mb-6 text-slate-800 tracking-tight">
								Live Timeline
							</h3>
							<div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
								{data.activityFeed.map((activity, i) => (
									<motion.div
										whileHover={{ x: 5 }}
										key={i}
										className="pl-6 relative group cursor-default"
									>
										<div className="absolute w-3.5 h-3.5 bg-blue-500 rounded-full -left-[9px] top-1 ring-4 ring-white group-hover:scale-125 transition-transform"></div>
										<p className="text-xs font-black text-blue-600 mb-1 tracking-wide">
											<Clock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
											{activity.time}
										</p>
										<p className="text-sm font-extrabold text-slate-800">
											{activity.title}
										</p>
										<p className="text-xs font-semibold text-slate-500 mt-1">
											{activity.desc}
										</p>
									</motion.div>
								))}
							</div>
						</div>

						{/* Upcoming Events */}
						<div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-lg transition-shadow">
							<h3 className="text-xl font-extrabold mb-5 text-slate-800 tracking-tight">
								Upcoming Events
							</h3>
							<div className="space-y-3">
								{[
									["Science Exhibition", "21 June"],
									["Sports Day", "28 June"],
									["Unit Test", "5 July"],
									["PTM Meeting", "10 July"],
								].map((event, i) => (
									<div
										key={i}
										className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
									>
										<span className="text-sm font-bold text-slate-700">
											{event[0]}
										</span>
										<span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
											{event[1]}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Mini Operation Widgets */}
						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
							<motion.div
								whileHover={{ scale: 1.02 }}
								className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-3xl border border-pink-100/50 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md transition-all"
							>
								<div className="p-3 bg-pink-500 shadow-lg shadow-pink-500/30 text-white rounded-2xl">
									<Gift className="w-6 h-6" />
								</div>
								<div>
									<p className="text-base font-extrabold text-slate-800">
										Today's Birthdays
									</p>
									<p className="text-xs font-bold text-pink-600 mt-0.5">
										4 Students • 1 Teacher
									</p>
								</div>
							</motion.div>

							<motion.div
								whileHover={{ scale: 1.02 }}
								className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-3xl border border-amber-100/50 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md transition-all"
							>
								<div className="p-3 bg-amber-500 shadow-lg shadow-amber-500/30 text-white rounded-2xl">
									<Bus className="w-6 h-6" />
								</div>
								<div>
									<p className="text-base font-extrabold text-slate-800">
										Transport Fleet
									</p>
									<p className="text-xs font-bold text-amber-700 mt-0.5">
										12 Active • 0 Delayed
									</p>
								</div>
							</motion.div>

							<motion.div
								whileHover={{ scale: 1.02 }}
								className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-3xl border border-cyan-100/50 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md transition-all"
							>
								<div className="p-3 bg-cyan-500 shadow-lg shadow-cyan-500/30 text-white rounded-2xl">
									<BookOpen className="w-6 h-6" />
								</div>
								<div>
									<p className="text-base font-extrabold text-slate-800">
										Library Status
									</p>
									<p className="text-xs font-bold text-cyan-700 mt-0.5">
										84 Issued Today • 12 Pending
									</p>
								</div>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
