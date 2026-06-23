import {
	LayoutDashboard,
	BookOpen,
	CalendarDays,
	FileSignature,
	Trophy,
	CreditCard,
	Library,
	Download,
} from "lucide-react";

export const studentMenuData = [
	{
		name: "Dashboard",
		icon: LayoutDashboard,
		isDropdown: false,
		link: "/students/dashboard",
	},
	{
		name: "Learning",
		icon: BookOpen,
		isDropdown: true,
		subItems: [
			{ label: "My Subjects", link: "/students/learning/subjects" },
			{
				label: "Study Material",
				link: "/students/learning/study-material",
			},
			{ label: "Homework", link: "/students/learning/homework" },
			{ label: "Assignments", link: "/students/learning/assignments" },
			{
				label: "Online Classes",
				link: "/students/learning/online-classes",
			},
		],
	},
	{
		name: "Academics",
		icon: CalendarDays,
		isDropdown: true,
		subItems: [
			{ label: "Timetable", link: "/students/academics/timetable" },
			{ label: "Attendance", link: "/students/academics/attendance" },
			{ label: "Syllabus", link: "/students/academics/syllabus" },
			{ label: "Lesson Plans", link: "/students/academics/lesson-plans" },
		],
	},
	{
		name: "Exams & Results",
		icon: FileSignature,
		isDropdown: true,
		subItems: [
			{ label: "Exam Schedule", link: "/students/exams/schedule" },
			{ label: "Results", link: "/students/exams/results" },
		],
	},
	{
		name: "Activities",
		icon: Trophy,
		isDropdown: true,
		subItems: [
			{ label: "Events", link: "/students/activities/events" },
			{
				label: "Competitions",
				link: "/students/activities/competitions",
			},
			{ label: "Sports", link: "/students/activities/sports" },
			{
				label: "Achievements",
				link: "/students/activities/achievements",
			},
		],
	},
	{
		name: "Fees",
		icon: CreditCard,
		isDropdown: true,
		subItems: [
			{ label: "Fee Status", link: "/students/fees/status" },
			{ label: "Payment History", link: "/students/fees/history" },
			{ label: "Receipts", link: "/students/fees/receipts" },
		],
	},
	{
		name: "Services",
		icon: Library,
		isDropdown: true,
		subItems: [
			{ label: "Library", link: "/students/services/library" },
			{ label: "Transport", link: "/students/services/transport" },
			{ label: "Hostel", link: "/students/services/hostel" },
			{ label: "Medical Records", link: "/students/services/medical" },
		],
	},
	{
		name: "Downloads",
		icon: Download,
		isDropdown: true,
		subItems: [
			{
				label: "Study Materials",
				link: "/students/downloads/study-materials",
			},
			{ label: "Certificates", link: "/students/downloads/certificates" },
			{ label: "ID Card", link: "/students/downloads/id-card" },
			{ label: "Documents", link: "/students/downloads/documents" },
		],
	},
];
