"use client";
import React, { useState } from "react";
import { 
  BookOpen, Search, Plus, Users, BookMarked, AlertCircle, Edit, Trash2, Filter, GraduationCap, X, Check, Save 
} from "lucide-react";

// --- Mock Master Data (In real app, this comes from your DB) ---
const AVAILABLE_CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const AVAILABLE_TEACHERS = [
  { id: "t1", name: "Rajesh Sharma", initials: "RS" },
  { id: "t2", name: "Anita Desai", initials: "AD" },
  { id: "t3", name: "Dr. Vikram Singh", initials: "VS" },
  { id: "t4", name: "Pooja Verma", initials: "PV" },
  { id: "t5", name: "Karan Johar", initials: "KJ" }
];

export default function SubjectsManagementPage() {
  // ================= STATE MANAGEMENT =================
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, Core, Elective, Co-Curricular
  
  // Drawer & Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: "", name: "", type: "Core", classesTaught: [], teachers: []
  });

  // DB State (MOCK)
  const [subjectsData, setSubjectsData] = useState([
    {
      id: "sub_1", code: "MAT-101", name: "Mathematics", type: "Core",
      classesTaught: ["Class 9", "Class 10"],
      teachers: [AVAILABLE_TEACHERS[0], AVAILABLE_TEACHERS[1]]
    },
    {
      id: "sub_2", code: "ART-401", name: "Fine Arts", type: "Co-Curricular",
      classesTaught: ["Class 6", "Class 7"],
      teachers: []
    }
  ]);

  // ================= ACTION HANDLERS =================

  // Open Drawer for Add/Edit
  const openDrawer = (subject = null) => {
    if (subject) {
      setEditingId(subject.id);
      setFormData({ ...subject });
    } else {
      setEditingId(null);
      setFormData({ code: "", name: "", type: "Core", classesTaught: [], teachers: [] });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingId(null);
  };

  // Toggle Classes in Form
  const toggleClass = (cls) => {
    setFormData(prev => ({
      ...prev,
      classesTaught: prev.classesTaught.includes(cls) 
        ? prev.classesTaught.filter(c => c !== cls) 
        : [...prev.classesTaught, cls]
    }));
  };

  // Toggle Teachers in Form
  const toggleTeacher = (teacher) => {
    setFormData(prev => {
      const exists = prev.teachers.find(t => t.id === teacher.id);
      return {
        ...prev,
        teachers: exists 
          ? prev.teachers.filter(t => t.id !== teacher.id) 
          : [...prev.teachers, teacher]
      };
    });
  };

  // Save Subject (Create or Update)
  const handleSave = () => {
    if (!formData.name || !formData.code) return alert("Subject Name and Code are required!");

    if (editingId) {
      // Update
      setSubjectsData(prev => prev.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
    } else {
      // Create
      setSubjectsData(prev => [...prev, { ...formData, id: `sub_${Date.now()}` }]);
    }
    closeDrawer();
  };

  // Delete Subject
  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this subject?")) {
      setSubjectsData(prev => prev.filter(s => s.id !== id));
    }
  };

  // Filter Logic
  const filteredSubjects = subjectsData.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || sub.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || sub.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans flex flex-col relative overflow-hidden">
      
      {/* ===================== HEADER & OVERVIEW ===================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <BookOpen className="text-indigo-600" size={28} />
            Subject Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Map academic subjects with faculties and categorize curriculum.</p>
        </div>
        
        <button onClick={() => openDrawer()} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md">
          <Plus size={18} /> Add New Subject
        </button>
      </div>

      {/* ===================== CONTROLS & SEARCH ===================== */}
      <div className="bg-white p-4 rounded-t-2xl border border-slate-200 border-b-0 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by subject name or code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400"/>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all outline-none"
          >
            <option value="All">All Types</option>
            <option value="Core">Core</option>
            <option value="Elective">Elective</option>
            <option value="Co-Curricular">Co-Curricular</option>
          </select>
        </div>
      </div>

      {/* ===================== PREMIUM DATA LIST ===================== */}
      <div className="bg-white border border-slate-200 rounded-b-2xl shadow-sm overflow-hidden flex-1">
        {filteredSubjects.length === 0 ? (
           <div className="p-12 text-center flex flex-col items-center">
             <AlertCircle size={40} className="text-slate-300 mb-3"/>
             <span className="text-slate-500 font-medium">No subjects found matching your criteria.</span>
           </div>
        ) : (
          <div className="flex flex-col">
            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:grid">
              <div className="col-span-3 pl-4">Subject Info</div>
              <div className="col-span-2 text-center">Type</div>
              <div className="col-span-3">Assigned Teachers</div>
              <div className="col-span-3">Taught In (Classes)</div>
              <div className="col-span-1 text-right pr-4">Actions</div>
            </div>

            {filteredSubjects.map((sub) => (
              <div key={sub.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
                
                <div className="col-span-3 pl-0 md:pl-4">
                  <div className="font-black text-slate-800 text-base">{sub.name}</div>
                  <div className="text-xs font-mono font-semibold text-slate-500 mt-0.5">{sub.code}</div>
                </div>

                <div className="col-span-2 flex md:justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold 
                    ${sub.type === 'Core' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 
                      sub.type === 'Elective' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                      'bg-purple-50 text-purple-700 border border-purple-100'}`}>
                    {sub.type}
                  </span>
                </div>

                <div className="col-span-3 flex items-center gap-2">
                  {sub.teachers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {sub.teachers.map(teacher => (
                        <div key={teacher.id} className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm" title={teacher.name}>
                          <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-bold">
                            {teacher.initials}
                          </div>
                          <span className="text-xs font-bold text-slate-700 truncate max-w-[80px]">{teacher.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-lg text-xs font-bold">
                      Unassigned
                    </div>
                  )}
                </div>

                <div className="col-span-3 flex flex-wrap gap-1.5">
                   {sub.classesTaught.length > 0 ? sub.classesTaught.map((clsName, idx) => (
                     <span key={idx} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                       {clsName}
                     </span>
                   )) : <span className="text-xs text-slate-400 italic">No classes selected</span>}
                </div>

                <div className="col-span-1 flex justify-start md:justify-end items-center gap-2 pr-0 md:pr-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openDrawer(sub)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(sub.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===================== SLIDE-OUT DRAWER (ADD/EDIT FORM) ===================== */}
      {/* Backdrop */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm transition-opacity" onClick={closeDrawer}></div>
      )}
      
      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-black text-slate-800">{editingId ? 'Edit Subject' : 'Add New Subject'}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Configure subject details and assignments</p>
          </div>
          <button onClick={closeDrawer} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
        </div>

        {/* Drawer Body (Scrollable Form) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject Name <span className="text-red-500">*</span></label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Computer Science" className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"/>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject Code <span className="text-red-500">*</span></label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. CS-101" className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono font-bold text-indigo-700"/>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-semibold bg-white">
                  <option value="Core">Core</option>
                  <option value="Elective">Elective</option>
                  <option value="Co-Curricular">Co-Curricular</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Interactive Class Assignment */}
          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assign to Classes</label>
             <div className="flex flex-wrap gap-2">
                {AVAILABLE_CLASSES.map(cls => {
                  const isSelected = formData.classesTaught.includes(cls);
                  return (
                    <button 
                      key={cls} onClick={() => toggleClass(cls)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5
                        ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'}`}
                    >
                      {isSelected && <Check size={12}/>} {cls}
                    </button>
                  );
                })}
             </div>
          </div>

          <hr className="border-slate-100" />

          {/* Interactive Teacher Assignment */}
          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assign Teachers</label>
             <div className="flex flex-col gap-2">
                {AVAILABLE_TEACHERS.map(teacher => {
                  const isSelected = formData.teachers.some(t => t.id === teacher.id);
                  return (
                    <div 
                      key={teacher.id} onClick={() => toggleTeacher(teacher)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all
                        ${isSelected ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${isSelected ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                          {teacher.initials}
                        </div>
                        <span className={`text-sm font-bold ${isSelected ? 'text-emerald-800' : 'text-slate-700'}`}>{teacher.name}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-slate-50 text-transparent'}`}>
                        <Check size={14} />
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
           <button onClick={closeDrawer} className="px-4 py-3 border border-slate-300 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
           <button onClick={handleSave} className="px-4 py-3 bg-indigo-600 rounded-xl text-white font-bold text-sm hover:bg-indigo-700 shadow-md transition-colors flex items-center justify-center gap-2">
             <Save size={16}/> {editingId ? 'Update Subject' : 'Save Subject'}
           </button>
        </div>
      </div>

    </div>
  );
}