export const parentMenuData = [
  {
    title: "Dashboard",
    icon: "🏠",
    path: "/parents/dashboard",
  },
  {
    title: "My Child",
    icon: "👨‍🎓",
    subMenus: [
      { title: "Student Profile", path: "/parents/child/profile" },
      { title: "Academic Information", path: "/parents/child/academic-info" },
      { title: "Class & Section", path: "/parents/child/class-section" },
      { title: "Student Documents", path: "/parents/child/documents" },
    ],
  },
  {
    title: "Academics",
    icon: "📚",
    subMenus: [
      { title: "Subjects", path: "/parents/academics/subjects" },
      { title: "Syllabus", path: "/parents/academics/syllabus" },
      { title: "Homework", path: "/parents/academics/homework" },
      { title: "Assignments", path: "/parents/academics/assignments" },
      { title: "Study Materials", path: "/parents/academics/study-materials" },
    ],
  },
  {
    title: "Attendance",
    icon: "📅",
    subMenus: [
      { title: "Attendance Summary", path: "/parents/attendance/summary" },
      { title: "Monthly Attendance", path: "/parents/attendance/monthly" },
      { title: "Leave Requests", path: "/parents/attendance/leave-requests" },
    ],
  },
  {
    title: "Exams & Results",
    icon: "📝",
    subMenus: [
      { title: "Exam Schedule", path: "/parents/exams/schedule" },
      { title: "Results", path: "/parents/exams/results" },
      { title: "Report Card", path: "/parents/exams/report-card" },
      { title: "Performance Analysis", path: "/parents/exams/performance" },
    ],
  },
  {
    title: "Fees & Payments",
    icon: "💰",
    subMenus: [
      { title: "Fee Details", path: "/parents/fees/details" },
      { title: "Pending Fees", path: "/parents/fees/pending" },
      { title: "Online Payment", path: "/parents/fees/pay" },
      { title: "Payment History", path: "/parents/fees/history" },
      { title: "Receipts", path: "/parents/fees/receipts" },
    ],
  },
  {
    title: "Communication",
    icon: "💬",
    subMenus: [
      { title: "Messages", path: "/parents/communication/messages" },
      { title: "Teacher Communication", path: "/parents/communication/teachers" },
      { title: "School Notices", path: "/parents/communication/notices" },
      { title: "PTM Schedule", path: "/parents/communication/ptm" },
    ],
  },
  {
    title: "Transport",
    icon: "🚌",
    subMenus: [
      { title: "Route Details", path: "/parents/transport/route" },
      { title: "Driver Information", path: "/parents/transport/driver" },
      { title: "Bus Tracking", path: "/parents/transport/tracking" },
    ],
  },
  {
    title: "Activities",
    icon: "🏆",
    subMenus: [
      { title: "Events", path: "/parents/activities/events" },
      { title: "Competitions", path: "/parents/activities/competitions" },
      { title: "Sports", path: "/parents/activities/sports" },
      { title: "Achievements", path: "/parents/activities/achievements" },
    ],
  },
  {
    title: "Services",
    icon: "📖",
    subMenus: [
      { title: "Library Status", path: "/parents/services/library" },
      { title: "Issued Books", path: "/parents/services/issued-books" },
      { title: "Fine Details", path: "/parents/services/fines" },
    ],
  },
  {
    title: "Downloads",
    icon: "📂",
    subMenus: [
      { title: "Report Cards", path: "/parents/downloads/report-cards" },
      { title: "Certificates", path: "/parents/downloads/certificates" },
      { title: "Fee Receipts", path: "/parents/downloads/receipts" },
      { title: "ID Card", path: "/parents/downloads/id-card" },
      { title: "School Documents", path: "/parents/downloads/documents" },
    ],
  },
  {
    title: "Account",
    icon: "👤",
    subMenus: [
      { title: "Parent Profile", path: "/parents/account/profile" },
      { title: "Linked Students", path: "/parents/account/linked-students" },
      { title: "Settings", path: "/parents/account/settings" },
      { title: "Change Password", path: "/parents/account/change-password" },
      { title: "Logout", path: "/logout" },
    ],
  }
];