// "use client"
export const teacherMenuData = [
  {
    title: "Dashboard",
    icon: "🏠",
    path: "/teachers/dashboard",
  },
  {
    title: "My Classes",
    icon: "👨‍🎓",
    subMenus: [
      { title: "Class List", path: "/teachers/classes/list" },
      { title: "Class Students", path: "/teachers/classes/students" },
      { title: "Class Performance", path: "/teachers/classes/performance" },
    ],
  },
  {
    title: "Academics",
    icon: "📚",
    subMenus: [
      { title: "Subjects", path: "/teachers/academics/subjects" },
      { title: "Lesson Plans", path: "/teachers/academics/lesson-plans" },
      { title: "Syllabus Progress", path: "/teachers/academics/syllabus-progress" },
      { title: "Study Materials", path: "/teachers/academics/study-materials" },
      { title: "Question Bank", path: "/teachers/academics/question-bank" },
    ],
  },
  {
    title: "Homework & Assignments",
    icon: "📝",
    subMenus: [
      { title: "Create Homework", path: "/teachers/assignments/create-homework" },
      { title: "Create Assignment", path: "/teachers/assignments/create-assignment" },
      { title: "Submissions", path: "/teachers/assignments/submissions" },
      { title: "Evaluation", path: "/teachers/assignments/evaluation" },
    ],
  },
  {
    title: "Attendance",
    icon: "📅",
    subMenus: [
      { title: "Mark Attendance", path: "/teachers/attendance/mark" },
      { title: "Attendance Reports", path: "/teachers/attendance/reports" },
      { title: "Student Leave Requests", path: "/teachers/attendance/leave-requests" },
    ],
  },
  {
    title: "Timetable",
    icon: "⏰",
    subMenus: [
      { title: "My Timetable", path: "/teachers/timetable/view" },
      { title: "Substitute Classes", path: "/teachers/timetable/substitute" },
      { title: "Extra Classes", path: "/teachers/timetable/extra" },
    ],
  },
  {
    title: "Examinations",
    icon: "🎯",
    subMenus: [
      { title: "Exam Schedule", path: "/teachers/exams/schedule" },
      { title: "Marks Entry", path: "/teachers/exams/marks-entry" },
      { title: "Grade Book", path: "/teachers/exams/grade-book" },
      { title: "Result Analysis", path: "/teachers/exams/result-analysis" },
      { title: "Report Cards", path: "/teachers/exams/report-cards" },
    ],
  },
  {
    title: "Communication",
    icon: "💬",
    subMenus: [
      { title: "Announcements", path: "/teachers/communication/announcements" },
      { title: "Parent Messages", path: "/teachers/communication/parents" },
      { title: "Student Messages", path: "/teachers/communication/students" },
      { title: "Circulars", path: "/teachers/communication/circulars" },
    ],
  },
  {
    title: "Activities",
    icon: "🏆",
    subMenus: [
      { title: "Events", path: "/teachers/activities/events" },
      { title: "Competitions", path: "/teachers/activities/competitions" },
      { title: "Sports Records", path: "/teachers/activities/sports" },
      { title: "Student Achievements", path: "/teachers/activities/achievements" },
    ],
  },
  {
    title: "Reports & Analytics",
    icon: "📊",
    subMenus: [
      { title: "Class Performance", path: "/teachers/reports/class-performance" },
      { title: "Subject Performance", path: "/teachers/reports/subject-performance" },
      { title: "Attendance Analytics", path: "/teachers/reports/attendance" },
      { title: "Student Progress Reports", path: "/teachers/reports/student-progress" },
    ],
  },
  {
    title: "Services",
    icon: "📖",
    subMenus: [
      { title: "Library", path: "/teachers/services/library" },
      { title: "Transport", path: "/teachers/services/transport" },
      { title: "Inventory Requests", path: "/teachers/services/inventory" },
    ],
  },
  {
    title: "Leave & HR",
    icon: "🗓️",
    subMenus: [
      { title: "Apply Leave", path: "/teachers/hr/apply-leave" },
      { title: "Leave History", path: "/teachers/hr/leave-history" },
      { title: "Attendance Log", path: "/teachers/hr/attendance-log" },
      { title: "Salary Slips", path: "/teachers/hr/salary-slips" },
    ],
  },
  {
    title: "My Account",
    icon: "👤",
    subMenus: [
      { title: "Profile", path: "/teachers/account/profile" },
      { title: "Documents", path: "/teachers/account/documents" },
      { title: "Settings", path: "/teachers/account/settings" },
      { title: "Change Password", path: "/teachers/account/change-password" },
      { title: "Logout", path: "/logout" },
    ],
  }
];