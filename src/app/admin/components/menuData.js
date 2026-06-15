import { 
  Users, UserCheck, BookOpen, ClipboardCheck, FileSpreadsheet, 
  CreditCard, Users2, Bookmark, Bus, MessageSquare, HeartPulse, 
  PartyPopper, Box, BarChart3, Settings, ShieldAlert, LayoutDashboard
} from 'lucide-react';

export const menuConfig = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    isDropdown: false,
    link: "/admin/dashboard"
  },
  {
    name: "Students",
    icon: Users,
    isDropdown: true,
    subItems: [
      { label: "Student List", link: "/dashboard/students/list" },
      { label: "New Admission", link: "/dashboard/students/admission" },
      { label: "Student Attendance", link: "/dashboard/students/attendance" },
      { label: "Student Promotion", link: "/dashboard/students/promotion" },
      { label: "Transfer Certificate (TC)", link: "/dashboard/students/tc" },
      { label: "Student ID Cards", link: "/dashboard/students/id-cards" },
      { label: "Alumni Students", link: "/dashboard/students/alumni" },
      { label: "Documents Management", link: "/dashboard/students/documents" }
    ]
  },
  {
    name: "Teachers",
    icon: UserCheck,
    isDropdown: true,
    subItems: [
      { label: "Teacher List", link: "/dashboard/teachers/list" },
      { label: "Add Teacher", link: "/dashboard/teachers/add" },
      { label: "Attendance", link: "/dashboard/teachers/attendance" },
      { label: "Leave Requests", link: "/dashboard/teachers/leaves" },
      { label: "Payroll", link: "/dashboard/teachers/payroll" },
      { label: "Performance Evaluation", link: "/dashboard/teachers/performance" },
      { label: "Teacher Documents", link: "/dashboard/teachers/documents" }
    ]
  },
  {
    name: "Academics",
    icon: BookOpen,
    isDropdown: true,
    subItems: [
      { label: "Classes", link: "/dashboard/academics/classes" },
      { label: "Sections", link: "/dashboard/academics/sections" },
      { label: "Subjects", link: "/dashboard/academics/subjects" },
      { label: "Timetable", link: "/dashboard/academics/timetable" },
      { label: "Assignments", link: "/dashboard/academics/assignments" },
      { label: "Lesson Plans", link: "/dashboard/academics/lessons" },
      { label: "Academic Calendar", link: "/dashboard/academics/calendar" },
      { label: "Syllabus Management", link: "/dashboard/academics/syllabus" }
    ]
  },
  {
    name: "Attendance",
    icon: ClipboardCheck,
    isDropdown: true,
    subItems: [
      { label: "Daily Attendance", link: "/dashboard/attendance/daily" },
      { label: "Monthly Attendance", link: "/dashboard/attendance/monthly" },
      { label: "Biometric Attendance", link: "/dashboard/attendance/biometric" },
      { label: "Attendance Reports", link: "/dashboard/attendance/reports" }
    ]
  },
  {
    name: "Examination",
    icon: FileSpreadsheet,
    isDropdown: true,
    subItems: [
      { label: "Exam Types", link: "/dashboard/exams/types" },
      { label: "Exam Schedule", link: "/dashboard/exams/schedule" },
      { label: "Marks Entry", link: "/dashboard/exams/marks" },
      { label: "Grade System", link: "/dashboard/exams/grades" },
      { label: "Report Cards", link: "/dashboard/exams/report-cards" },
      { label: "Result Analysis", link: "/dashboard/exams/analysis" },
      { label: "Hall Tickets", link: "/dashboard/exams/hall-tickets" }
    ]
  },
  {
    name: "Fees & Finance",
    icon: CreditCard,
    isDropdown: true,
    subItems: [
      { label: "Fee Structure", link: "/dashboard/finance/structure" },
      { label: "Fee Collection", link: "/dashboard/finance/collect" },
      { label: "Due Fees", link: "/dashboard/finance/due" },
      { label: "Fee Discounts", link: "/dashboard/finance/discounts" },
      { label: "Scholarships", link: "/dashboard/finance/scholarships" },
      { label: "Expenses", link: "/dashboard/finance/expenses" },
      { label: "Income", link: "/dashboard/finance/income" },
      { label: "Financial Reports", link: "/dashboard/finance/reports" }
    ]
  },
  {
    name: "Parents",
    icon: Users2,
    isDropdown: true,
    subItems: [
      { label: "Parent List", link: "/dashboard/parents/list" },
      { label: "Parent Accounts", link: "/dashboard/parents/accounts" },
      { label: "Parent Feedback", link: "/dashboard/parents/feedback" },
      { label: "Parent Meetings", link: "/dashboard/parents/meetings" }
    ]
  },
  {
    name: "Library",
    icon: Bookmark,
    isDropdown: true,
    subItems: [
      { label: "Books", link: "/dashboard/library/books" },
      { label: "Categories", link: "/dashboard/library/categories" },
      { label: "Issue Books", link: "/dashboard/library/issue" },
      { label: "Return Books", link: "/dashboard/library/return" },
      { label: "Fine Collection", link: "/dashboard/library/fine" }
    ]
  },
  {
    name: "Transport",
    icon: Bus,
    isDropdown: true,
    subItems: [
      { label: "Vehicles", link: "/dashboard/transport/vehicles" },
      { label: "Routes", link: "/dashboard/transport/routes" },
      { label: "Drivers", link: "/dashboard/transport/drivers" },
      { label: "Student Allocation", link: "/dashboard/transport/allocation" },
      { label: "Fuel & Maintenance", link: "/dashboard/transport/maintenance" }
    ]
  },
  {
    name: "Communication",
    icon: MessageSquare,
    isDropdown: true,
    subItems: [
      { label: "Announcements", link: "/dashboard/communication/announcements" },
      { label: "SMS", link: "/dashboard/communication/sms" },
      { label: "Email", link: "/dashboard/communication/email" },
      { label: "Circulars", link: "/dashboard/communication/circulars" },
      { label: "Events", link: "/dashboard/communication/events" }
    ]
  },
  {
    name: "Health",
    icon: HeartPulse,
    isDropdown: true,
    subItems: [
      { label: "Medical Records", link: "/dashboard/health/records" },
      { label: "Health Checkups", link: "/dashboard/health/checkups" },
      { label: "Vaccination Records", link: "/dashboard/health/vaccinations" },
      { label: "Emergency Contacts", link: "/dashboard/health/emergency" }
    ]
  },
  {
    name: "Events & Activities",
    icon: PartyPopper,
    isDropdown: true,
    subItems: [
      { label: "School Events", link: "/dashboard/events/list" },
      { label: "Competitions", link: "/dashboard/events/competitions" },
      { label: "Sports Activities", link: "/dashboard/events/sports" },
      { label: "Cultural Programs", link: "/dashboard/events/cultural" }
    ]
  },
  {
    name: "Inventory",
    icon: Box,
    isDropdown: true,
    subItems: [
      { label: "Classroom Assets", link: "/dashboard/inventory/classroom" },
      { label: "Lab Equipment", link: "/dashboard/inventory/lab" },
      { label: "Stationery", link: "/dashboard/inventory/stationery" },
      { label: "Stock Management", link: "/dashboard/inventory/stock" }
    ]
  },
  {
    name: "Reports",
    icon: BarChart3,
    isDropdown: true,
    subItems: [
      { label: "Admission Reports", link: "/dashboard/reports/admission" },
      { label: "Attendance Reports", link: "/dashboard/reports/attendance" },
      { label: "Fee Reports", link: "/dashboard/reports/fees" },
      { label: "Exam Reports", link: "/dashboard/reports/exams" },
      { label: "Library Reports", link: "/dashboard/reports/library" },
      { label: "Transport Reports", link: "/dashboard/reports/transport" }
    ]
  },
  {
    name: "User Management",
    icon: ShieldAlert,
    isDropdown: true,
    subItems: [
      { label: "Admins", link: "/dashboard/users/admins" },
      { label: "Teachers", link: "/dashboard/users/teachers" },
      { label: "Students", link: "/dashboard/users/students" },
      { label: "Parents", link: "/dashboard/users/parents" },
      { label: "Roles & Permissions", link: "/dashboard/users/permissions" }
    ]
  },
  {
    name: "Settings",
    icon: Settings,
    isDropdown: true,
    subItems: [
      { label: "School Profile", link: "/dashboard/settings/profile" },
      { label: "Academic Sessions", link: "/dashboard/settings/sessions" },
      { label: "User Roles", link: "/dashboard/settings/roles" },
      { label: "Permissions", link: "/dashboard/settings/permissions" },
      { label: "Notification Settings", link: "/dashboard/settings/notifications" },
      { label: "Backup & Restore", link: "/dashboard/settings/backup" }
    ]
  }
];