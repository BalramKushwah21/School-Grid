import {
	LayoutDashboard,
	Users,
	BookOpen,
	FileText,
	CheckSquare,
	UserCheck,
	MessageSquare,
	BarChart3,
	Library,
	CalendarDays,
	User,
} from "lucide-react";

export const teacherMenuData = [
	{
		name: "Dashboard",
		icon: LayoutDashboard,
		isDropdown: false,
		link: "/teachers/dashboard",
	},
	{
		name: "My Classes",
		icon: Users,
		isDropdown: true,
		subItems: [
			{ label: "Class List", link: "/teachers/pages/students/classes" },
			{ label: "Students Profile", link: "/teachers/pages/students/studentsList" },
			{
				label: "Class Performance",
				link: "/teachers/pages/students/performance",
			},
		],
	},

	{
		name: "Attendance",
		icon: UserCheck,
		isDropdown: true,
		subItems: [
			{ label: "Mark Attendance", link: "/teachers/pages/attendance/markAttendance" },
			{ label: "View Reports", link: "/teachers/attendance/reports" },
			{
				label: "Leave Requests",
				link: "/teachers/attendance/leave-requests",
			},
		],
	},
	{
		name: "Academics",
		icon: BookOpen,
		isDropdown: true,
		subItems: [
			{ label: "Subjects", link: "/teachers/academics/subjects" },
			{ label: "Lesson Plans", link: "/teachers/academics/lesson-plans" },
			{
				label: "Syllabus Progress",
				link: "/teachers/academics/syllabus-progress",
			},
			{
				label: "Study Materials",
				link: "/teachers/academics/study-materials",
			},
			{
				label: "Question Bank",
				link: "/teachers/academics/question-bank",
			},
		],
	},
	{
		name: "Homework & Assignments",
		icon: FileText,
		isDropdown: true,
		subItems: [
			{
				label: "Create Homework",
				link: "/teachers/assignments/create-homework",
			},
			{
				label: "Create Assignment",
				link: "/teachers/assignments/create-assignment",
			},
			{
				label: "Evaluate Submissions",
				link: "/teachers/assignments/evaluate",
			},
		],
	},
	{
		name: "Examinations",
		icon: CheckSquare,
		isDropdown: true,
		subItems: [
			{ label: "Exam Schedule", link: "/teachers/exams/schedule" },
			{ label: "Enter Marks", link: "/teachers/exams/enter-marks" },
			{ label: "Result Generation", link: "/teachers/exams/results" },
		],
	},
	
	{
		name: "Communication",
		icon: MessageSquare,
		isDropdown: true,
		subItems: [
			{ label: "Messages", link: "/teachers/communication/messages" },
			{ label: "Notice Board", link: "/teachers/communication/notices" },
			{
				label: "Parent Connect",
				link: "/teachers/communication/parents",
			},
		],
	},
	{
		name: "Reports & Analytics",
		icon: BarChart3,
		isDropdown: true,
		subItems: [
			{
				label: "Class Performance",
				link: "/teachers/reports/class-performance",
			},
			{
				label: "Subject Performance",
				link: "/teachers/reports/subject-performance",
			},
			{
				label: "Attendance Analytics",
				link: "/teachers/reports/attendance",
			},
			{
				label: "Student Progress Reports",
				link: "/teachers/reports/student-progress",
			},
		],
	},
	{
		name: "Services",
		icon: Library,
		isDropdown: true,
		subItems: [
			{ label: "Library", link: "/teachers/services/library" },
			{ label: "Transport", link: "/teachers/services/transport" },
			{
				label: "Inventory Requests",
				link: "/teachers/services/inventory",
			},
		],
	},
	{
		name: "Leave & HR",
		icon: CalendarDays,
		isDropdown: true,
		subItems: [
			{ label: "Apply Leave", link: "/teachers/hr/apply-leave" },
			{ label: "Leave History", link: "/teachers/hr/leave-history" },
			{ label: "Attendance Log", link: "/teachers/hr/attendance-log" },
			{ label: "Salary Slips", link: "/teachers/hr/salary-slips" },
		],
	},
	{
		name: "My Account",
		icon: User,
		isDropdown: true,
		subItems: [
			{ label: "Profile", link: "/teachers/account/profile" },
			{ label: "Settings", link: "/teachers/account/settings" },
		],
	},
];
