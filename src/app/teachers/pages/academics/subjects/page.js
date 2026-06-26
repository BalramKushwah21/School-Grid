"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, Users, Calendar, LayoutDashboard, ChevronLeft, 
  BarChart2, FileText, CheckCircle, Clock, ChevronDown, 
  ChevronUp, Edit3, PlayCircle, Eye, FileSignature, Search, Filter 
} from 'lucide-react';

// 🗄️ INITIAL MOCK DATABASES
const INITIAL_SUBJECTS = [
  { id: 1, name: 'Mathematics', class: 'Class 8', section: 'A', students: 45, periods: 5, syllabus: 60, pendingChaps: 4, hwGiven: 12, assignments: 3 },
  { id: 2, name: 'Science', class: 'Class 8', section: 'B', students: 42, periods: 4, syllabus: 45, pendingChaps: 8, hwGiven: 8, assignments: 2 },
  { id: 3, name: 'Physics', class: 'Class 11', section: 'A', students: 38, periods: 6, syllabus: 30, pendingChaps: 10, hwGiven: 5, assignments: 1 },
];

const INITIAL_CHAPTERS = [
  { id: 101, name: 'Chapter 1: Integers', status: 'Completed', topics: [ { id: 1, name: 'Introduction to Integers', done: true }, { id: 2, name: 'Addition & Subtraction', done: true } ] },
  { id: 102, name: 'Chapter 2: Fractions', status: 'In Progress', topics: [ { id: 3, name: 'Proper & Improper', done: true }, { id: 4, name: 'Multiplication of Fractions', done: false } ] },
  { id: 103, name: 'Chapter 3: Decimals', status: 'Pending', topics: [ { id: 5, name: 'Decimals to Fractions', done: false }, { id: 6, name: 'Division of Decimals', done: false } ] }
];

const INITIAL_STUDENTS = [
  { roll: 1, name: 'Aarav Kumar', attendance: 92, avgMarks: 85 },
  { roll: 2, name: 'Bhavya Singh', attendance: 88, avgMarks: 78 },
  { roll: 3, name: 'Chirag Patel', attendance: 95, avgMarks: 91 },
  { roll: 4, name: 'Diya Sharma', attendance: 75, avgMarks: 65 },
  { roll: 5, name: 'Eshaan Verma', attendance: 60, avgMarks: 55 },
];

const TIMETABLE = [
  { day: 'Monday', period: '2nd Period (09:15 AM - 10:00 AM)' },
  { day: 'Wednesday', period: '5th Period (12:30 PM - 01:15 PM)' },
  { day: 'Friday', period: '1st Period (08:30 AM - 09:15 AM)' },
];

const MARKS_OVERVIEW = [
  { exam: 'Unit Test 1', avg: 72, highest: 95, lowest: 35 },
  { exam: 'Half Yearly', avg: 68, highest: 98, lowest: 28 },
  { exam: 'Final Exam', avg: 'TBD', highest: 'TBD', lowest: 'TBD' },
];

export default function SubjectMaster() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  
  const [chaptersData, setChaptersData] = useState(INITIAL_CHAPTERS);
  const [studentsData, setStudentsData] = useState(INITIAL_STUDENTS);
  const [expandedChapter, setExpandedChapter] = useState(null);

  const [subjectSearch, setSubjectSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('All'); 

  useEffect(() => {
    if (selectedSubject) {
      setChaptersData([...INITIAL_CHAPTERS]);
      setStudentsData([...INITIAL_STUDENTS]);
      setStudentSearch('');
      setAttendanceFilter('All');
    }
  }, [selectedSubject]);

  const filteredSubjects = useMemo(() => {
    return INITIAL_SUBJECTS.filter(sub => 
      sub.name.toLowerCase().includes(subjectSearch.toLowerCase()) || 
      sub.class.toLowerCase().includes(subjectSearch.toLowerCase())
    );
  }, [subjectSearch]);

  const filteredStudents = useMemo(() => {
    return studentsData.filter(stu => {
      const matchesSearch = stu.name.toLowerCase().includes(studentSearch.toLowerCase()) || stu.roll.toString().includes(studentSearch);
      const matchesAttendance = 
        attendanceFilter === 'All' || 
        (attendanceFilter === 'Good' && stu.attendance >= 80) ||
        (attendanceFilter === 'Low' && stu.attendance < 80);
      return matchesSearch && matchesAttendance;
    });
  }, [studentsData, studentSearch, attendanceFilter]);

  const updateChapterStatus = (chapterId, newStatus) => {
    setChaptersData(prevData => prevData.map(chap => {
      if (chap.id === chapterId) {
        let updatedTopics = chap.topics;
        if (newStatus === 'Completed') {
          updatedTopics = chap.topics.map(t => ({ ...t, done: true }));
        }
        return { ...chap, status: newStatus, topics: updatedTopics };
      }
      return chap;
    }));
  };

  const toggleTopicStatus = (chapterId, topicId) => {
    setChaptersData(prevData => prevData.map(chap => {
      if (chap.id === chapterId) {
        const updatedTopics = chap.topics.map(t => t.id === topicId ? { ...t, done: !t.done } : t);
        const anyTopicDone = updatedTopics.some(t => t.done);
        const allTopicsDone = updatedTopics.every(t => t.done);
        
        let newStatus = chap.status;
        if (allTopicsDone) newStatus = 'Completed';
        else if (anyTopicDone) newStatus = 'In Progress';
        
        return { ...chap, topics: updatedTopics, status: newStatus };
      }
      return chap;
    }));
  };

  // --------------------------------------------------------
  // VIEW 1: MY SUBJECTS LIST
  // --------------------------------------------------------
  if (!selectedSubject) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">My Subjects</h1>
            <p className="text-slate-500">Select a subject to manage syllabus, students, and marks.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Subject or Class..." 
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.length > 0 ? filteredSubjects.map((sub) => (
            <div 
              key={sub.id} 
              onClick={() => setSelectedSubject(sub)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-600 transition">
                  <BookOpen className="w-6 h-6 text-indigo-600 group-hover:text-white transition" />
                </div>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                  {sub.class}-{sub.section}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{sub.name}</h2>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
                <span className="text-slate-500 font-medium">{sub.students} Students</span>
                <span className="text-emerald-600 font-bold">{sub.syllabus}% Done</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">
              No subjects found matching your search.
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // VIEW 2: SUBJECT DETAIL DASHBOARD
  // --------------------------------------------------------
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setSelectedSubject(null); setActiveTab('Overview'); }}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{selectedSubject.name}</h1>
            <p className="text-slate-500 font-medium">{selectedSubject.class} - Section {selectedSubject.section}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {['Overview', 'Chapters', 'Timetable', 'Students', 'Marks'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'Overview' && <LayoutDashboard className="w-4 h-4 inline-block mr-2" />}
            {tab === 'Chapters' && <FileText className="w-4 h-4 inline-block mr-2" />}
            {tab === 'Timetable' && <Calendar className="w-4 h-4 inline-block mr-2" />}
            {tab === 'Students' && <Users className="w-4 h-4 inline-block mr-2" />}
            {tab === 'Marks' && <BarChart2 className="w-4 h-4 inline-block mr-2" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="mt-6">
        
        {/* TAB 1: OVERVIEW (✅ UPGRADED: Beautiful, Functional & Interactive) */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Students */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <button onClick={() => setActiveTab('Students')} className="text-xs font-bold text-indigo-600 hover:underline">View All →</button>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Students</p>
              <p className="text-4xl font-black text-slate-900">{selectedSubject.students}</p>
            </div>

            {/* Card 2: Periods */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Clock className="w-6 h-6" />
                </div>
                <button onClick={() => setActiveTab('Timetable')} className="text-xs font-bold text-blue-600 hover:underline">See Schedule →</button>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Weekly Periods</p>
              <p className="text-4xl font-black text-slate-900">{selectedSubject.periods}</p>
            </div>

            {/* Card 3: Syllabus Completed */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white p-3 rounded-xl text-emerald-600 shadow-sm">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
              <p className="text-emerald-800 text-sm font-bold uppercase tracking-wider mb-1">Syllabus Completed</p>
              <div className="flex items-end justify-between mb-3">
                <p className="text-4xl font-black text-emerald-900">{selectedSubject.syllabus}%</p>
              </div>
              {/* Animated Progress Bar */}
              <div className="w-full bg-emerald-200/60 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${selectedSubject.syllabus}%` }}></div>
              </div>
            </div>

            {/* Card 4: Pending Chapters */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white p-3 rounded-xl text-amber-600 shadow-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
                <button onClick={() => setActiveTab('Chapters')} className="text-xs font-bold text-amber-700 hover:underline">Manage Chapters →</button>
              </div>
              <p className="text-amber-800 text-sm font-bold uppercase tracking-wider mb-1">Pending Chapters</p>
              <p className="text-4xl font-black text-amber-900">{selectedSubject.pendingChaps}</p>
            </div>

            {/* Card 5: Homework */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-50 p-3 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <FileText className="w-6 h-6" />
                </div>
                <button className="text-xs font-bold px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-600 hover:text-white transition-colors shadow-sm">+ Assign HW</button>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Homework Given</p>
              <p className="text-4xl font-black text-slate-900">{selectedSubject.hwGiven}</p>
            </div>

            {/* Card 6: Assignments */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-200 hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-rose-50 p-3 rounded-xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                  <FileSignature className="w-6 h-6" />
                </div>
                <button className="text-xs font-bold px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-600 hover:text-white transition-colors shadow-sm">+ Create Task</button>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Assignments</p>
              <p className="text-4xl font-black text-slate-900">{selectedSubject.assignments}</p>
            </div>

          </div>
        )}

        {/* TAB 2: CHAPTERS & TOPICS */}
        {activeTab === 'Chapters' && (
          <div className="space-y-4">
            {chaptersData.map((chapter) => (
              <div key={chapter.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 border-b border-slate-200 transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                      className="p-1 hover:bg-slate-200 rounded-full transition"
                    >
                      {expandedChapter === chapter.id ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{chapter.name}</h3>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md mt-1 inline-block ${
                        chapter.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                        chapter.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {chapter.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {chapter.status === 'Pending' && (
                      <button 
                        onClick={() => updateChapterStatus(chapter.id, 'In Progress')}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg hover:bg-indigo-100 flex items-center gap-1 transition"
                      >
                        <PlayCircle className="w-4 h-4"/> Start
                      </button>
                    )}
                    {chapter.status === 'In Progress' && (
                      <button 
                        onClick={() => updateChapterStatus(chapter.id, 'Completed')}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-1 transition shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4"/> Complete
                      </button>
                    )}
                  </div>
                </div>

                {expandedChapter === chapter.id && (
                  <div className="p-5 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Topics List</h4>
                    {chapter.topics.map(topic => (
                      <div key={topic.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                          {topic.done ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-amber-500" />}
                          <span className={`font-semibold ${topic.done ? 'text-slate-900 line-through decoration-slate-300' : 'text-slate-600'}`}>
                            {topic.name}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => toggleTopicStatus(chapter.id, topic.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                              topic.done 
                                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {topic.done ? 'Undo' : 'Mark Done'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: TIMETABLE */}
        {activeTab === 'Timetable' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Weekly Schedule</h2>
            <div className="space-y-3">
              {TIMETABLE.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <div className="bg-indigo-100 text-indigo-700 font-black w-28 text-center py-2 rounded-lg text-sm uppercase tracking-wider">
                    {slot.day}
                  </div>
                  <div className="font-semibold text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" /> {slot.period}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STUDENTS */}
        {activeTab === 'Students' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-1">
            <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by Name or Roll No..." 
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select 
                  value={attendanceFilter} 
                  onChange={(e) => setAttendanceFilter(e.target.value)}
                  className="py-2 px-3 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 text-slate-700 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Attendance</option>
                  <option value="Good">Good (&gt;80%)</option>
                  <option value="Low">Low Warning (&lt;80%)</option>
                </select>
              </div>
            </div>

            <table className="w-full text-left border-collapse mt-2">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4">Roll No</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4 text-center">Attendance</th>
                  <th className="p-4 text-right">Avg Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? filteredStudents.map((stu) => (
                  <tr key={stu.roll} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900">#{stu.roll}</td>
                    <td className="p-4 font-semibold text-slate-700">{stu.name}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${stu.attendance >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {stu.attendance}%
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-indigo-600">{stu.avgMarks}/100</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500 font-medium">No students match your filter criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: MARKS OVERVIEW */}
        {activeTab === 'Marks' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MARKS_OVERVIEW.map((exam, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <FileSignature className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-lg text-slate-900">{exam.exam}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Class Average</span>
                    <span className="font-black text-slate-900">{exam.avg}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Highest Score</span>
                    <span className="font-black text-emerald-600">{exam.highest}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Lowest Score</span>
                    <span className="font-black text-rose-600">{exam.lowest}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}