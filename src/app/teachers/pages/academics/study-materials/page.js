"use client";
import React, { useState, useMemo } from 'react';
import { 
  FileText, Video, Link as LinkIcon, FileImage, 
  Download, Trash2, Plus, Search, Filter, FolderOpen,
  MoreVertical, X, UploadCloud
} from 'lucide-react';

// 🗄️ MOCK DATABASE: Initial Study Materials
const INITIAL_MATERIALS = [
  { id: 1, title: 'Trigonometry Formula Sheet', type: 'PDF', subject: 'Mathematics', class: 'Class 10', date: '24 Jun 2026', size: '2.4 MB', category: 'Notes' },
  { id: 2, title: 'Chemical Reactions Demo', type: 'Video', subject: 'Science', class: 'Class 10', date: '22 Jun 2026', size: '15 MB', category: 'Lecture' },
  { id: 3, title: 'World War II Map', type: 'Image', subject: 'History', class: 'Class 9', date: '20 Jun 2026', size: '1.2 MB', category: 'Reference' },
  { id: 4, title: 'CBSE Sample Paper 2025', type: 'PDF', subject: 'Mathematics', class: 'Class 10', date: '15 Jun 2026', size: '4.5 MB', category: 'Exam Prep' },
  { id: 5, title: 'Photosynthesis Interactive', type: 'Link', subject: 'Science', class: 'Class 9', date: '10 Jun 2026', size: '-', category: 'Reference' },
];

export default function StudyMaterial() {
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  
  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // 🧠 Core Filtering Logic
  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = classFilter === 'All' || item.class === classFilter;
      const matchesSubject = subjectFilter === 'All' || item.subject === subjectFilter;
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      
      return matchesSearch && matchesClass && matchesSubject && matchesType;
    });
  }, [materials, searchQuery, classFilter, subjectFilter, typeFilter]);

  // Handle Delete (Functional)
  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  // Helper: Get Icon based on file type
  const getFileIcon = (type) => {
    switch(type) {
      case 'PDF': return <FileText className="w-6 h-6 text-rose-500" />;
      case 'Video': return <Video className="w-6 h-6 text-purple-500" />;
      case 'Image': return <FileImage className="w-6 h-6 text-emerald-500" />;
      case 'Link': return <LinkIcon className="w-6 h-6 text-blue-500" />;
      default: return <FileText className="w-6 h-6 text-slate-500" />;
    }
  };

  // Helper: Get Background color based on file type
  const getFileBg = (type) => {
    switch(type) {
      case 'PDF': return 'bg-rose-50 border-rose-100';
      case 'Video': return 'bg-purple-50 border-purple-100';
      case 'Image': return 'bg-emerald-50 border-emerald-100';
      case 'Link': return 'bg-blue-50 border-blue-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans pb-24 md:pb-6 relative">
      
      {/* 1. HEADER & ACTION BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Study Material</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">Manage and share resources with your students.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 md:py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition transform active:scale-95"
        >
          <Plus className="w-5 h-5" /> Upload Material
        </button>
      </div>

      {/* 2. SMART SEARCH & FILTERS (Mobile Responsive) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row gap-3">
        
        {/* Search Bar */}
        <div className="flex-1 relative w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search notes, videos, links..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 md:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Filters Wrapper */}
        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <select 
            value={classFilter} 
            onChange={(e) => setClassFilter(e.target.value)}
            className="flex-1 md:w-32 py-3 md:py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="All">All Classes</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>

          <select 
            value={subjectFilter} 
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="flex-1 md:w-36 py-3 md:py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="All">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
          </select>

          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-32 py-3 md:py-2.5 px-3 bg-indigo-50 border border-indigo-200 rounded-xl text-sm font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="All">All Types</option>
            <option value="PDF">PDFs</option>
            <option value="Video">Videos</option>
            <option value="Link">Links</option>
            <option value="Image">Images</option>
          </select>
        </div>
      </div>

      {/* 3. MATERIAL GRID */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMaterials.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
              
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl border ${getFileBg(item.type)}`}>
                    {getFileIcon(item.type)}
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{item.title}</h3>
                <p className="text-sm font-medium text-indigo-600 mb-4">{item.subject} • {item.class}</p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                  <span>{item.date}</span>
                  {item.size !== '-' && <span>• {item.size}</span>}
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-slate-50 border-t border-slate-100 p-3 flex justify-between items-center">
                <button className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-slate-700 hover:text-indigo-600 py-2 transition-colors">
                  <Download className="w-4 h-4" /> {item.type === 'Link' ? 'Open' : 'Download'}
                </button>
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Material Found</h3>
          <p className="text-slate-500 mt-1 max-w-sm">Try adjusting your filters or upload a new study resource for the students.</p>
        </div>
      )}

      {/* 4. UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
            
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-slate-900">Upload Material</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                <input type="text" placeholder="e.g. Chapter 1 Notes" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Class</label>
                  <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium">
                    <option>Class 9</option>
                    <option>Class 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                  <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium">
                    <option>Science</option>
                    <option>Mathematics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Resource Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {['PDF', 'Video', 'Image', 'Link'].map((type) => (
                    <button key={type} className="py-2 px-1 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition">
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag & Drop Area */}
              <div className="mt-4 border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-indigo-400 transition cursor-pointer">
                <UploadCloud className="w-10 h-10 text-indigo-400 mb-3" />
                <p className="text-sm font-bold text-slate-700">Tap to browse or drag file here</p>
                <p className="text-xs text-slate-500 mt-1">Supports PDF, MP4, JPG (Max 50MB)</p>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button onClick={() => setIsUploadModalOpen(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition">Cancel</button>
              <button onClick={() => setIsUploadModalOpen(false)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">Upload File</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}