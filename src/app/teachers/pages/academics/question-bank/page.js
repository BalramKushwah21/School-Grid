"use client";
import React, { useState, useMemo } from 'react';
import { 
  Database, Search, Filter, Plus, ChevronDown, Edit3, Trash2, Tag, 
  BookOpen, CheckCircle, List, Type, HelpCircle, X, Download, Upload, 
  Eye, Copy, Share2, FileText, Layers, Target, CheckSquare, Settings2, MoreVertical
} from 'lucide-react';

// 🗄️ DB-OPTIMIZED MOCK DATA (Notice the 'metadata' JSON structure)
const INITIAL_QUESTIONS = [
  {
    id: 'q1', content: 'What is Photosynthesis?',
    class: 'Class 7', subject: 'Science', chapter: 'Chapter 2: Plants', topic: 'Nutrition',
    type: 'Short Answer', marks: 2, difficulty: 'Easy', status: 'Active',
    blooms_taxonomy: 'Remember', language: 'English', date_added: '2026-06-25',
    tags: ['Board Exam', 'Important'],
    metadata: {
      expected_answer: 'Photosynthesis is the process by which green plants make their own food using sunlight, water, and carbon dioxide.',
      explanation: 'Chlorophyll is required for this process to trap sunlight.',
      hints: 'Think about sunlight and green leaves.'
    }
  },
  {
    id: 'q2', content: 'Solve for x: $2x + 5 = 15$',
    class: 'Class 10', subject: 'Mathematics', chapter: 'Algebra', topic: 'Linear Equations',
    type: 'MCQ', marks: 1, difficulty: 'Medium', status: 'Active',
    blooms_taxonomy: 'Apply', language: 'English', date_added: '2026-06-26',
    tags: ['Unit Test'],
    metadata: {
      options: ['5', '10', '15', '20'],
      correct_answer: '5',
      explanation: 'Subtract 5 from both sides to get 2x = 10. Divide by 2 to get x = 5.'
    }
  },
  {
    id: 'q3', content: 'Read the passage and answer: The Industrial Revolution began in Britain in the 18th century...',
    class: 'Class 9', subject: 'History', chapter: 'Industrialization', topic: 'Origins',
    type: 'Case Study', marks: 5, difficulty: 'Hard', status: 'Draft',
    blooms_taxonomy: 'Analyze', language: 'English', date_added: '2026-06-20',
    tags: ['Final Exam', 'Olympiad'],
    metadata: {
      model_answer: '1. Britain had coal reserves. 2. Stable government. 3. Colonial resources.',
      explanation: 'The question tests reading comprehension and historical analysis.'
    }
  }
];

export default function QuestionBank() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modals
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    search: '', class: 'All', subject: 'All', type: 'All', difficulty: 'All', 
    status: 'All', blooms: 'All', chapter: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Dynamic Form State for "Add Question"
  const [newQType, setNewQType] = useState('MCQ');

  // --------------------------------------------------------
  // 🧠 CORE LOGIC & METRICS
  // --------------------------------------------------------

  // Apply Filters
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSearch = q.content.toLowerCase().includes(filters.search.toLowerCase());
      const matchClass = filters.class === 'All' || q.class === filters.class;
      const matchSubject = filters.subject === 'All' || q.subject === filters.subject;
      const matchType = filters.type === 'All' || q.type === filters.type;
      const matchDiff = filters.difficulty === 'All' || q.difficulty === filters.difficulty;
      const matchStatus = filters.status === 'All' || q.status === filters.status;
      const matchBlooms = filters.blooms === 'All' || q.blooms_taxonomy === filters.blooms;
      const matchChapter = filters.chapter === '' || q.chapter.toLowerCase().includes(filters.chapter.toLowerCase());
      
      return matchSearch && matchClass && matchSubject && matchType && matchDiff && matchStatus && matchBlooms && matchChapter;
    });
  }, [questions, filters]);

  // Calculate Summary Metrics
  const metrics = useMemo(() => {
    return questions.reduce((acc, q) => {
      acc.total++;
      if (q.type === 'MCQ') acc.mcq++;
      if (q.type.includes('Subjective') || q.type.includes('Answer')) acc.subjective++;
      if (q.type === 'Case Study') acc.caseStudy++;
      if (q.difficulty === 'Easy') acc.easy++;
      if (q.difficulty === 'Medium') acc.medium++;
      if (q.difficulty === 'Hard') acc.hard++;
      
      // Calculate recently added (last 7 days logic simulated)
      const qDate = new Date(q.date_added);
      if (qDate >= new Date('2026-06-19')) acc.recent++;
      
      return acc;
    }, { total: 0, mcq: 0, subjective: 0, caseStudy: 0, easy: 0, medium: 0, hard: 0, recent: 0 });
  }, [questions]);

  // Bulk Selection Logic
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(filteredQuestions.map(q => q.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleBulkDelete = () => {
    if(window.confirm(`Delete ${selectedIds.length} questions?`)) {
      setQuestions(questions.filter(q => !selectedIds.includes(q.id)));
      setSelectedIds([]);
    }
  };

  // Preview Logic
  const openPreview = (q) => {
    setCurrentQuestion(q);
    setIsPreviewOpen(true);
  };

  // --------------------------------------------------------
  // UI RENDERING
  // --------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans pb-24 md:pb-6 relative text-slate-800">
      
      {/* 1. HEADER & GLOBAL ACTIONS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-600" /> Question Bank Master
          </h1>
          <p className="text-slate-500 mt-1">Manage assessment items, import/export, and build test papers.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm inline-flex">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button className="flex-1 lg:flex-none items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm inline-flex">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setIsAddOpen(true)} className="flex-1 lg:flex-none w-full lg:w-auto items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md inline-flex">
            <Plus className="w-5 h-5" /> Add Question
          </button>
        </div>
      </div>

      {/* 2. SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {[
          { label: 'Total', val: metrics.total, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
          { label: 'MCQ', val: metrics.mcq, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Subjective', val: metrics.subjective, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
          { label: 'Case Study', val: metrics.caseStudy, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50 border-fuchsia-100' },
          { label: 'Easy', val: metrics.easy, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Medium', val: metrics.medium, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Hard', val: metrics.hard, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
          { label: 'Recent (7d)', val: metrics.recent, color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' },
        ].map((stat, i) => (
          <div key={i} className={`p-3 rounded-2xl border ${stat.bg} shadow-sm text-center flex flex-col justify-center`}>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* 3. MEGA FILTERS & BULK ACTIONS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-3">
        
        {/* Bulk Actions Bar (Visible only when items selected) */}
        {selectedIds.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex flex-wrap items-center justify-between mb-4 animate-in fade-in zoom-in-95">
            <span className="font-bold text-indigo-800 px-2">{selectedIds.length} Questions Selected</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-bold shadow-sm flex items-center gap-1"><Tag className="w-3.5 h-3.5"/> Add Tags</button>
              <button className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-bold shadow-sm flex items-center gap-1"><Download className="w-3.5 h-3.5"/> Export PDFs</button>
              <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-1 hover:bg-rose-700"><Trash2 className="w-3.5 h-3.5"/> Delete All</button>
            </div>
          </div>
        )}

        {/* Primary Search Row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" placeholder="Search questions by text..." 
              value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select value={filters.class} onChange={e => setFilters({...filters, class: e.target.value})} className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium w-full md:w-32">
            <option value="All">All Classes</option><option>Class 7</option><option>Class 9</option><option>Class 10</option>
          </select>
          <select value={filters.subject} onChange={e => setFilters({...filters, subject: e.target.value})} className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium w-full md:w-36">
            <option value="All">All Subjects</option><option>Science</option><option>Mathematics</option><option>History</option>
          </select>
          <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 flex items-center justify-center gap-2 transition">
            <Settings2 className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Advanced Filters (Expandable) */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-slate-100 animate-in slide-in-from-top-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Question Type</label>
              <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
                <option value="All">All Types</option><option>MCQ</option><option>Short Answer</option><option>Case Study</option><option>TrueFalse</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Difficulty</label>
              <select value={filters.difficulty} onChange={e => setFilters({...filters, difficulty: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
                <option value="All">All</option><option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Bloom's Taxonomy</label>
              <select value={filters.blooms} onChange={e => setFilters({...filters, blooms: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
                <option value="All">All</option><option>Remember</option><option>Understand</option><option>Apply</option><option>Analyze</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
              <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
                <option value="All">All Status</option><option>Active</option><option>Draft</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Chapter Search</label>
              <input type="text" placeholder="e.g. Algebra" value={filters.chapter} onChange={e => setFilters({...filters, chapter: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
            </div>
          </div>
        )}
      </div>

      {/* 4. MAIN DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4 w-12 text-center">
                <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredQuestions.length && filteredQuestions.length > 0} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </th>
              <th className="p-4 w-1/3">Question Preview</th>
              <th className="p-4">Class & Subject</th>
              <th className="p-4">Type & Marks</th>
              <th className="p-4">Classification</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredQuestions.length > 0 ? filteredQuestions.map((q) => (
              <tr key={q.id} className={`hover:bg-indigo-50/30 transition-colors ${selectedIds.includes(q.id) ? 'bg-indigo-50/50' : ''}`}>
                <td className="p-4 text-center">
                  <input type="checkbox" checked={selectedIds.includes(q.id)} onChange={() => handleSelectOne(q.id)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-indigo-600" onClick={() => openPreview(q)}>{q.content}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {q.tags.map(tag => <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{tag}</span>)}
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-800 text-sm">{q.subject}</p>
                  <p className="text-xs text-slate-500">{q.class} • {q.chapter.split(':')[0]}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-700 text-sm">{q.type}</p>
                  <p className="text-xs font-black text-indigo-600">{q.marks} Marks</p>
                </td>
                <td className="p-4 space-y-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {q.difficulty}
                  </span>
                  <p className="text-xs font-semibold text-slate-500">{q.blooms_taxonomy}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center w-fit gap-1 ${q.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {q.status === 'Active' && <CheckCircle className="w-3 h-3"/>} {q.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center items-center gap-1">
                    <button onClick={() => openPreview(q)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="View"><Eye className="w-4 h-4"/></button>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit3 className="w-4 h-4"/></button>
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Duplicate"><Copy className="w-4 h-4"/></button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" className="p-12 text-center text-slate-500 font-medium">No questions match your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --------------------------------------------------- */}
      {/* 5. QUESTION PREVIEW MODAL */}
      {/* --------------------------------------------------- */}
      {isPreviewOpen && currentQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-black">{currentQuestion.marks} Marks</span>
                <span className="text-sm font-bold text-slate-600">{currentQuestion.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-white text-slate-500 rounded-lg hover:bg-slate-200 shadow-sm"><Share2 className="w-4 h-4" /></button>
                <button onClick={() => setIsPreviewOpen(false)} className="p-2 bg-white text-slate-500 rounded-lg hover:bg-slate-200 shadow-sm"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex gap-2 mb-4 text-xs font-bold text-slate-400">
                <span>{currentQuestion.class}</span> • <span>{currentQuestion.subject}</span> • <span>{currentQuestion.chapter}</span>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 leading-relaxed mb-6">
                Q. {currentQuestion.content}
              </h2>

              {/* Dynamic Answer Rendering */}
              {currentQuestion.type === 'MCQ' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {currentQuestion.metadata.options.map((opt, i) => (
                    <div key={i} className={`p-4 rounded-xl border-2 font-medium flex justify-between items-center ${opt === currentQuestion.metadata.correct_answer ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                      <span>{String.fromCharCode(65 + i)}. {opt}</span>
                      {opt === currentQuestion.metadata.correct_answer && <CheckCircle className="w-5 h-5 text-emerald-500"/>}
                    </div>
                  ))}
                </div>
              )}

              {(currentQuestion.type.includes('Answer') || currentQuestion.type === 'Case Study') && (
                <div className="mb-6">
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Model Answer / Key</p>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-medium leading-relaxed">
                    {currentQuestion.metadata.expected_answer || currentQuestion.metadata.model_answer}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4">
                <p className="text-xs font-extrabold text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1"><HelpCircle className="w-4 h-4"/> Explanation & Logic</p>
                <p className="text-sm text-blue-900">{currentQuestion.metadata.explanation}</p>
              </div>

              <div className="flex gap-2 flex-wrap mt-6 pt-6 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center gap-1"><Target className="w-3 h-3"/> {currentQuestion.blooms_taxonomy}</span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center gap-1"><Layers className="w-3 h-3"/> Difficulty: {currentQuestion.difficulty}</span>
                {currentQuestion.tags.map(tag => <span key={tag} className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">#{tag}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* 6. ADVANCED "ADD QUESTION" MODAL (DB-Friendly Config) */}
      {/* --------------------------------------------------- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl mt-10 md:mt-0 mb-20 md:mb-0 overflow-hidden flex flex-col max-h-[95vh]">
            
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5"/> Create New Question</h2>
                <p className="text-xs text-slate-400 mt-1">Fields are dynamically adjusted based on JSONB database architecture.</p>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="p-2 text-slate-400 hover:text-white transition rounded-full hover:bg-slate-800"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Section A: Classification */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 text-indigo-600">1. Classification</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Class</label>
                      <select className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50"><option>Class 10</option></select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                      <select className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50"><option>Science</option></select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Chapter</label>
                      <input type="text" placeholder="e.g. Chapter 1" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Topic</label>
                      <input type="text" placeholder="e.g. Equations" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50" />
                    </div>
                  </div>
                </div>

                {/* Section B: Question Setup */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 text-indigo-600">2. Content & Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Question Type</label>
                      <select value={newQType} onChange={(e) => setNewQType(e.target.value)} className="w-full p-2.5 border-2 border-indigo-200 bg-indigo-50 text-indigo-800 font-bold rounded-xl text-sm outline-none focus:border-indigo-500">
                        <option value="MCQ">Multiple Choice (MCQ)</option>
                        <option value="Subjective">Subjective / Long Answer</option>
                        <option value="TrueFalse">True / False</option>
                        <option value="FillBlanks">Fill in the Blanks</option>
                        <option value="CaseStudy">Case Study</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Marks</label>
                      <input type="number" min="1" defaultValue="1" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Difficulty</label>
                      <select className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50"><option>Easy</option><option>Medium</option><option>Hard</option></select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 flex justify-between">Question Text <span className="text-indigo-400 font-normal">LaTeX Supported ($...$)</span></label>
                    <textarea rows="4" placeholder="Type the question content here..." className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50 resize-y"></textarea>
                    <div className="flex gap-2 mt-2">
                      <button className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-200"><Upload className="w-3 h-3"/> Attach Image</button>
                      <button className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-200"><FileText className="w-3 h-3"/> Attach File</button>
                    </div>
                  </div>
                </div>

                {/* Section C: DYNAMIC JSON METADATA CONFIG */}
                <div className="bg-slate-50 -mx-6 p-6 border-y border-slate-200">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500"/> 3. Answer Configuration (JSON Metadata)
                  </h3>
                  
                  {newQType === 'MCQ' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Option A', 'Option B', 'Option C', 'Option D'].map((opt, i) => (
                        <div key={i} className="flex gap-3 items-center bg-white p-2 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                          <input type="radio" name="correctOpt" className="w-4 h-4 ml-2 text-emerald-600 focus:ring-emerald-500" />
                          <input type="text" placeholder={`Enter ${opt}`} className="flex-1 p-2 text-sm outline-none border-none" />
                        </div>
                      ))}
                    </div>
                  )}

                  {newQType === 'Subjective' || newQType === 'CaseStudy' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Expected Answer / Grading Key</label>
                        <textarea rows="3" placeholder="Enter the exact points teacher should look for..." className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white resize-y"></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Model Answer (Shown to Students)</label>
                        <textarea rows="3" placeholder="Enter the perfectly written answer..." className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-white resize-y"></textarea>
                      </div>
                    </div>
                  ) : null}

                  {newQType === 'TrueFalse' && (
                    <div className="flex gap-6 items-center bg-white p-4 rounded-xl border border-slate-200">
                      <label className="flex items-center gap-2 font-bold text-slate-700 text-lg"><input type="radio" name="tf" defaultChecked className="w-5 h-5 text-emerald-600" /> True</label>
                      <label className="flex items-center gap-2 font-bold text-slate-700 text-lg"><input type="radio" name="tf" className="w-5 h-5 text-emerald-600" /> False</label>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Explanation & Logic</label>
                    <textarea rows="2" placeholder="Why is this answer correct? Provide theory or formula..." className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-blue-50/50 resize-y"></textarea>
                  </div>
                </div>

                {/* Section D: Advanced Config */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 text-indigo-600">4. Advanced Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Bloom's Taxonomy Level</label>
                      <select className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50">
                        <option>Remember</option><option>Understand</option><option>Apply</option>
                        <option>Analyze</option><option>Evaluate</option><option>Create</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tags (Comma separated)</label>
                      <input type="text" placeholder="e.g. Board, Important" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                      <select className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-emerald-50 text-emerald-800 font-bold">
                        <option>Active</option><option>Draft</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAddOpen(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">Cancel</button>
              <button onClick={() => setIsAddOpen(false)} className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md flex items-center gap-2">
                <CheckSquare className="w-5 h-5"/> Save Question
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}