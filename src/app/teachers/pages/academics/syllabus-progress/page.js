"use client";
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, CheckCircle, Clock, ChevronDown, ChevronUp, 
  Search, Target, AlertCircle, PlayCircle 
} from 'lucide-react';

// 🗄️ MOCK DATABASE: Syllabus Structure
const INITIAL_SYLLABUS = [
  {
    id: 'sub_1',
    className: 'Class 10',
    section: 'A',
    subject: 'Science',
    chapters: [
      { 
        id: 'c1', name: 'Chemical Reactions', status: 'Completed', 
        topics: [{ id: 't1', name: 'Equations', done: true }, { id: 't2', name: 'Types of Reactions', done: true }] 
      },
      { 
        id: 'c2', name: 'Acids, Bases and Salts', status: 'In Progress', 
        topics: [{ id: 't3', name: 'Chemical Properties', done: true }, { id: 't4', name: 'pH Scale', done: false }] 
      },
      { 
        id: 'c3', name: 'Metals and Non-metals', status: 'Pending', 
        topics: [{ id: 't5', name: 'Physical Properties', done: false }, { id: 't6', name: 'Extraction', done: false }] 
      }
    ]
  },
  {
    id: 'sub_2',
    className: 'Class 10',
    section: 'A',
    subject: 'Mathematics',
    chapters: [
      { 
        id: 'c4', name: 'Real Numbers', status: 'Completed', 
        topics: [{ id: 't7', name: 'Euclid Lemma', done: true }, { id: 't8', name: 'Irrational Numbers', done: true }] 
      },
      { 
        id: 'c5', name: 'Polynomials', status: 'Pending', 
        topics: [{ id: 't9', name: 'Zeroes of Polynomial', done: false }, { id: 't10', name: 'Division Algorithm', done: false }] 
      }
    ]
  }
];

export default function SyllabusProgress() {
  const [syllabusData, setSyllabusData] = useState(INITIAL_SYLLABUS);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub_1');
  const [expandedChapter, setExpandedChapter] = useState(null);

  // 🧠 Core Logic: Get Current Subject Data
  const currentSubject = useMemo(() => {
    return syllabusData.find(sub => sub.id === selectedSubjectId);
  }, [syllabusData, selectedSubjectId]);

  // 🧠 Core Logic: Calculate Overall Progress Real-time
  const progressStats = useMemo(() => {
    if (!currentSubject) return { percent: 0, completed: 0, total: 0 };
    
    let totalTopics = 0;
    let completedTopics = 0;
    
    currentSubject.chapters.forEach(chap => {
      chap.topics.forEach(t => {
        totalTopics++;
        if (t.done) completedTopics++;
      });
    });

    return {
      percent: totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100),
      completed: completedTopics,
      total: totalTopics
    };
  }, [currentSubject]);

  // ⚡ Action: Toggle Topic Done/Undone (Mobile Tap Friendly)
  const toggleTopic = (chapterId, topicId) => {
    setSyllabusData(prev => prev.map(sub => {
      if (sub.id !== selectedSubjectId) return sub;

      const updatedChapters = sub.chapters.map(chap => {
        if (chap.id !== chapterId) return chap;

        const updatedTopics = chap.topics.map(t => t.id === topicId ? { ...t, done: !t.done } : t);
        
        // Auto-update chapter status
        const allDone = updatedTopics.every(t => t.done);
        const someDone = updatedTopics.some(t => t.done);
        let newStatus = 'Pending';
        if (allDone) newStatus = 'Completed';
        else if (someDone) newStatus = 'In Progress';

        return { ...chap, topics: updatedTopics, status: newStatus };
      });

      return { ...sub, chapters: updatedChapters };
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans pb-24 md:pb-6">
      
      {/* 1. HEADER (Mobile Optimized) */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Syllabus Tracker</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1">Track and update course progress in real-time.</p>
      </div>

      {/* 2. MOBILE-FRIENDLY FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="flex-1 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>
          <select 
            value={selectedSection} 
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-24 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="A">Sec A</option>
            <option value="B">Sec B</option>
          </select>
        </div>

        <select 
          value={selectedSubjectId} 
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="w-full md:w-64 py-3 px-4 bg-indigo-50 border border-indigo-200 rounded-xl text-sm font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          {syllabusData.filter(s => s.className === selectedClass && s.section === selectedSection).map(sub => (
            <option key={sub.id} value={sub.id}>{sub.subject}</option>
          ))}
        </select>
      </div>

      {currentSubject ? (
        <div className="space-y-6">
          
          {/* 3. MASTER PROGRESS CARD */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 opacity-50"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" /> {currentSubject.subject} Overview
                </h2>
                <p className="text-sm text-slate-500 mt-1">Based on topics completed</p>
              </div>
              <div className="text-right w-full md:w-auto flex items-center justify-between md:block">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Overall Progress</span>
                <p className="text-3xl font-black text-indigo-600">{progressStats.percent}%</p>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${progressStats.percent}%` }}
              ></div>
            </div>
            <p className="text-xs font-bold text-slate-500 text-right">
              {progressStats.completed} of {progressStats.total} Topics Done
            </p>
          </div>

          {/* 4. CHAPTER ACCORDION LIST (Touch Friendly) */}
          <div className="space-y-3">
            {currentSubject.chapters.map((chapter) => (
              <div key={chapter.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Accordion Header (Large Tap Target) */}
                <button 
                  onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                  className="w-full p-4 md:p-5 flex items-center justify-between text-left active:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-base md:text-lg text-slate-900 leading-tight">{chapter.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${
                        chapter.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                        chapter.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {chapter.status}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {chapter.topics.filter(t => t.done).length}/{chapter.topics.length} Topics
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-full shrink-0">
                    {expandedChapter === chapter.id ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </button>

                {/* Topics List (Expanded) */}
                {expandedChapter === chapter.id && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-3 md:p-5 space-y-2">
                    {chapter.topics.map(topic => (
                      <div 
                        key={topic.id} 
                        onClick={() => toggleTopic(chapter.id, topic.id)}
                        className={`flex items-center justify-between p-3 md:p-4 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${
                          topic.done 
                            ? 'bg-white border-2 border-emerald-100 shadow-sm' 
                            : 'bg-white border border-slate-200 shadow-sm hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 md:gap-4 pr-2">
                          <div className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                            topic.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-slate-50'
                          }`}>
                            {topic.done && <CheckCircle className="w-4 h-4" />}
                          </div>
                          <span className={`text-sm md:text-base font-semibold transition-colors ${
                            topic.done ? 'text-slate-400 line-through' : 'text-slate-800'
                          }`}>
                            {topic.name}
                          </span>
                        </div>
                        
                        {/* Status Label (Visible clearly on mobile) */}
                        <span className={`shrink-0 text-xs font-bold ${topic.done ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {topic.done ? 'Done' : 'Mark Done'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No syllabus data found for this class selection.</p>
        </div>
      )}

    </div>
  );
}