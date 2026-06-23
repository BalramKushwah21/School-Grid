"use client"

// students/components/menuData.js

export const studentMenuData = [
  {
    title: "Dashboard",
    icon: "🏠",
    path: "/student/dashboard",
  },
  {
    title: "Learning",
    icon: "📚",
    subMenus: [
      { title: "My Subjects", path: "/students/learning/subjects" },
      { title: "Study Material", path: "/students/learning/study-material" },
      { title: "Homework", path: "/students/learning/homework" },
      { title: "Assignments", path: "/students/learning/assignments" },
      { title: "Online Classes", path: "/students/learning/online-classes" },
    ],
  },
  {
    title: "Academics",
    icon: "📅",
    subMenus: [
      { title: "Timetable", path: "/students/academics/timetable" },
      { title: "Attendance", path: "/students/academics/attendance" },
      { title: "Syllabus", path: "/students/academics/syllabus" },
      // Note: Kept Lesson Plans per your layout, though typically a teacher-side feature
      { title: "Lesson Plans", path: "/students/academics/lesson-plans" }, 
    ],
  },
  {
    title: "Exams & Results",
    icon: "📝",
    subMenus: [
      { title: "Exam Schedule", path: "/students/exams/schedule" },
      { title: "Admit Card", path: "/students/exams/admit-card" },
      { title: "Results", path: "/students/exams/results" },
      { title: "Report Card", path: "/students/exams/report-card" },
    ],
  },
  {
    title: "Communication",
    icon: "💬",
    subMenus: [
      { title: "Announcements", path: "/students/communication/announcements" },
      { title: "Messages", path: "/students/communication/messages" },
      { title: "Teacher Chat", path: "/students/communication/teacher-chat" },
    ],
  },
  {
    title: "Activities",
    icon: "🏆",
    subMenus: [
      { title: "Events", path: "/students/activities/events" },
      { title: "Competitions", path: "/students/activities/competitions" },
      { title: "Sports", path: "/students/activities/sports" },
      { title: "Achievements", path: "/students/activities/achievements" },
    ],
  },
  {
    title: "Fees",
    icon: "💰",
    subMenus: [
      { title: "Fee Status", path: "/students/fees/status" },
      { title: "Payment History", path: "/students/fees/history" },
      { title: "Receipts", path: "/students/fees/receipts" },
    ],
  },
  {
    title: "Services",
    icon: "📖",
    subMenus: [
      { title: "Library", path: "/students/services/library" },
      { title: "Transport", path: "/students/services/transport" },
      { title: "Hostel", path: "/students/services/hostel" },
      { title: "Medical Records", path: "/students/services/medical" },
    ],
  },
  {
    title: "Downloads",
    icon: "📂",
    subMenus: [
      { title: "Study Materials", path: "/students/downloads/study-materials" },
      { title: "Certificates", path: "/students/downloads/certificates" },
      { title: "ID Card", path: "/students/downloads/id-card" },
      { title: "Documents", path: "/students/downloads/documents" },
    ],
  },
  {
    title: "My Account",
    icon: "👤",
    subMenus: [
      { title: "Profile", path: "/students/account/profile" },
      { title: "Settings", path: "/students/account/settings" },
      { title: "Change Password", path: "/students/account/change-password" },
      { title: "Logout", path: "/logout" },
    ],
  }
];