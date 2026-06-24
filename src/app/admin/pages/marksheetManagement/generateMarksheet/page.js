"use client";
import React, { useState } from "react";
import { Settings, Layout, Plus, Trash2, Save, Type, Eye, Image as ImageIcon, BookOpen } from "lucide-react";

export default function MarksheetTemplateBuilder() {
  // 🗄️ Master Configuration State (This gets saved to the Database as JSON)
  const [template, setTemplate] = useState({
    id: "tpl_" + Date.now(),
    templateName: "Custom Dynamic Marksheet",
    themeColor: "#1e3a8a", // Default Blue
    header: {
      showLogo: true,
      logoUrl: "", // Admin can paste a default logo URL
      schoolName: "Enter School Name",
      address: "Enter School Address",
      affiliation: "Affiliation No: XXXXXX",
    },
    profile: {
      showStudentPhoto: true,
    },
    // Dynamic Rows for Subjects
    subjects: [
      { id: "sub_1", name: "English" },
      { id: "sub_2", name: "Hindi" },
      { id: "sub_3", name: "Mathematics" },
      { id: "sub_4", name: "Science" },
    ],
    // Dynamic Columns for the Marks Table
    scholasticColumns: [
      { id: "col_sub", label: "Subject", type: "text", key: "subjectName" },
      { id: "col_t1", label: "Term 1 (50)", type: "number", key: "term1" },
      { id: "col_t2", label: "Term 2 (50)", type: "number", key: "term2" },
      { id: "col_tot", label: "Total (100)", type: "formula", formula: "term1+term2" },
      { id: "col_grd", label: "Grade", type: "grade" },
    ],
    footer: {
      showRemarks: true,
      signatures: ["Class Teacher", "Principal"],
    }
  });

  const [activeTab, setActiveTab] = useState("table");
  const [newSubject, setNewSubject] = useState("");

  // --- Handlers for Dynamic Columns (Exams) ---
  const addColumn = () => {
    const newCol = { id: `col_${Date.now()}`, label: "New Exam", type: "number", key: `exam_${Date.now()}` };
    setTemplate({ ...template, scholasticColumns: [...template.scholasticColumns, newCol] });
  };

  const updateColumn = (id, field, value) => {
    const updatedCols = template.scholasticColumns.map(col => 
      col.id === id ? { ...col, [field]: value } : col
    );
    setTemplate({ ...template, scholasticColumns: updatedCols });
  };

  const removeColumn = (id) => {
    setTemplate({ ...template, scholasticColumns: template.scholasticColumns.filter(col => col.id !== id) });
  };

  // --- Handlers for Dynamic Rows (Subjects) ---
  const addSubject = () => {
    if (!newSubject.trim()) return;
    const newSub = { id: `sub_${Date.now()}`, name: newSubject.trim() };
    setTemplate({ ...template, subjects: [...template.subjects, newSub] });
    setNewSubject("");
  };

  const removeSubject = (id) => {
    setTemplate({ ...template, subjects: template.subjects.filter(sub => sub.id !== id) });
  };

  // --- Save to Database ---
  const handleSaveTemplate = () => {
    console.log("Saving Template to DB Payload:", JSON.stringify(template, null, 2));
    alert("✨ Premium Template Saved Successfully! This JSON blueprint is ready to map with student backend data.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      
      {/* =========================================
          LEFT PANEL: Template Control Center
          ========================================= */}
      <div className="w-[450px] bg-white border-r border-slate-200 shadow-xl flex flex-col z-10 h-screen overflow-y-auto">
        <div className="p-6 bg-slate-900 text-white">
          <h1 className="text-xl font-bold flex items-center gap-2"><Layout size={20}/> Template Builder</h1>
          <p className="text-sm text-slate-400 mt-1">Design rows, columns & aesthetics</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <button onClick={() => setActiveTab("header")} className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'header' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Header</button>
          <button onClick={() => setActiveTab("subjects")} className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'subjects' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Subjects (Rows)</button>
          <button onClick={() => setActiveTab("table")} className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'table' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Exams (Columns)</button>
        </div>

        {/* Controls Content */}
        <div className="p-6 flex-1 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* HEADER & PROFILE TAB */}
          {activeTab === "header" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Theme Color</label>
                <input type="color" value={template.themeColor} onChange={(e) => setTemplate({...template, themeColor: e.target.value})} className="w-full h-12 rounded-lg cursor-pointer border-none p-0"/>
              </div>
              <hr className="border-slate-100" />
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer mb-3">
                  <input type="checkbox" checked={template.header.showLogo} onChange={(e) => setTemplate({...template, header: {...template.header, showLogo: e.target.checked}})} className="w-4 h-4 text-blue-600"/>
                  Show School Logo
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer mb-3">
                  <input type="checkbox" checked={template.profile.showStudentPhoto} onChange={(e) => setTemplate({...template, profile: {...template.profile, showStudentPhoto: e.target.checked}})} className="w-4 h-4 text-blue-600"/>
                  Show Student Passport Photo
                </label>
                <p className="text-xs text-slate-500 ml-6">Photos will be automatically mapped from the backend database.</p>
              </div>
              <hr className="border-slate-100" />
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">School Name Heading</label>
                <input type="text" value={template.header.schoolName} onChange={(e) => setTemplate({...template, header: {...template.header, schoolName: e.target.value}})} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 ring-blue-500 outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">School Address</label>
                <input type="text" value={template.header.address} onChange={(e) => setTemplate({...template, header: {...template.header, address: e.target.value}})} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 ring-blue-500 outline-none"/>
              </div>
            </div>
          )}

          {/* SUBJECTS (ROWS) TAB */}
          {activeTab === "subjects" && (
            <div>
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Add New Subject</label>
                <div className="flex gap-2">
                  <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSubject()} placeholder="e.g., Computer Science" className="flex-1 p-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"/>
                  <button onClick={addSubject} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"><Plus size={18}/></button>
                </div>
              </div>
              
              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Current Subjects (Rows)</label>
              <div className="space-y-2">
                {template.subjects.map((sub, index) => (
                  <div key={sub.id} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg bg-slate-50 group hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono text-xs">{index + 1}.</span>
                      <span className="text-sm font-semibold text-slate-700">{sub.name}</span>
                    </div>
                    <button onClick={() => removeSubject(sub.id)} className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50"><Trash2 size={16}/></button>
                  </div>
                ))}
                {template.subjects.length === 0 && (
                  <div className="text-center p-4 text-sm text-slate-500 border border-dashed rounded-lg">No subjects added. Table will be empty.</div>
                )}
              </div>
            </div>
          )}

          {/* EXAMS (COLUMNS) TAB */}
          {activeTab === "table" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase">Exam Structure (Columns)</label>
                <button onClick={addColumn} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 transition-colors"><Plus size={14}/> Add Exam</button>
              </div>
              <div className="space-y-4">
                {template.scholasticColumns.map((col, index) => (
                  <div key={col.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative group">
                    {index !== 0 && (
                      <button onClick={() => removeColumn(col.id)} className="absolute -right-2 -top-2 bg-white border border-slate-200 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-colors"><Trash2 size={14}/></button>
                    )}
                    <input type="text" value={col.label} onChange={(e) => updateColumn(col.id, 'label', e.target.value)} className="w-full p-2.5 mb-3 text-sm font-bold border border-slate-300 rounded-lg shadow-sm outline-none focus:border-blue-500" placeholder="Column Heading (e.g. Unit Test 1)"/>
                    <div className="flex gap-2">
                      <select value={col.type} onChange={(e) => updateColumn(col.id, 'type', e.target.value)} className="flex-1 p-2 text-xs border border-slate-300 rounded-md outline-none bg-white">
                        <option value="text">Label / Subject</option>
                        <option value="number">Marks Input</option>
                        <option value="formula">Auto Total</option>
                        <option value="grade">Auto Grade</option>
                      </select>
                      <input type="text" value={col.key} onChange={(e) => updateColumn(col.id, 'key', e.target.value)} className="flex-1 p-2 text-xs border border-slate-300 rounded-md outline-none bg-white font-mono text-indigo-600" placeholder="DB Key Map"/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl text-xs text-indigo-800 border border-indigo-100 leading-relaxed">
                <strong>💡 DB Key Map:</strong> Maps the column to your database values. If a school has 3 exams, simply click <strong>Add Exam</strong> to create a new column, and set its key to map to the backend (e.g., <code>term_3</code>).
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button onClick={handleSaveTemplate} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200">
            <Save size={18}/> Save Marksheet Layout
          </button>
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL: Live A4 Visual Preview
          ========================================= */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-200/50 custom-scrollbar">
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[15mm] flex flex-col relative transition-all duration-300">
          
          {/* Header Preview */}
          <div className="flex items-center justify-between border-b-4 pb-6 mb-6" style={{ borderColor: template.themeColor }}>
            {template.header.showLogo && (
              <div className="w-24 h-24 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400">
                <ImageIcon size={28} />
                <span className="text-[10px] mt-1 font-semibold">DB LOGO</span>
              </div>
            )}
            
            <div className={`text-center ${!template.header.showLogo && !template.profile.showStudentPhoto ? 'w-full' : 'flex-1 px-4'}`}>
              <h1 className="text-4xl font-serif font-bold uppercase tracking-widest" style={{ color: template.themeColor }}>
                {template.header.schoolName || "SCHOOL NAME"}
              </h1>
              <p className="text-sm font-medium text-slate-600 mt-2">{template.header.address || "School Address Line"}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">{template.header.affiliation}</p>
              <div className="mt-4 bg-slate-100 text-slate-800 font-bold px-6 py-1.5 inline-block rounded-full border border-slate-300 text-sm tracking-widest">PROGRESS REPORT</div>
            </div>

            {template.profile.showStudentPhoto && (
              <div className="w-24 h-32 bg-slate-100 border-2 border-slate-300 rounded-md flex flex-col items-center justify-center text-slate-400 overflow-hidden relative">
                <div className="w-10 h-10 rounded-full bg-slate-200 mb-2"></div>
                <div className="w-16 h-16 rounded-t-full bg-slate-200 absolute -bottom-4"></div>
                <span className="text-[10px] mt-1 font-semibold z-10 bg-white/80 px-1 rounded">DB PHOTO</span>
              </div>
            )}
          </div>

          {/* Dummy Student Info Blocks */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-8 text-sm">
            <div className="flex border-b border-dashed border-slate-300 pb-1"><span className="font-bold w-32 text-slate-700">Student Name:</span> <span className="text-slate-500 italic">[Backend Data]</span></div>
            <div className="flex border-b border-dashed border-slate-300 pb-1"><span className="font-bold w-32 text-slate-700">Roll No:</span> <span className="text-slate-500 italic">[Backend Data]</span></div>
            <div className="flex border-b border-dashed border-slate-300 pb-1"><span className="font-bold w-32 text-slate-700">Class & Sec:</span> <span className="text-slate-500 italic">[Backend Data]</span></div>
            <div className="flex border-b border-dashed border-slate-300 pb-1"><span className="font-bold w-32 text-slate-700">Date of Birth:</span> <span className="text-slate-500 italic">[Backend Data]</span></div>
          </div>

          {/* Dynamic Marks Table Preview (Now loops through user-defined subjects) */}
          <table className="w-full border-collapse border-2 border-slate-800 text-sm text-center mb-8">
            <thead>
              <tr style={{ backgroundColor: template.themeColor, color: '#ffffff' }}>
                {template.scholasticColumns.map((col) => (
                  <th key={col.id} className="border border-slate-400 p-3 font-bold uppercase tracking-wide text-xs">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {template.subjects.length > 0 ? (
                template.subjects.map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-300 hover:bg-slate-50">
                    {template.scholasticColumns.map((col, index) => (
                      <td key={col.id} className={`border border-slate-300 p-2.5 ${index === 0 ? 'text-left font-bold text-slate-800 bg-slate-50/50' : 'text-slate-500 font-medium'}`}>
                        {index === 0 ? sub.name : col.type === 'formula' ? '[Auto]' : col.type === 'grade' ? 'A' : '--'}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={template.scholasticColumns.length} className="p-8 text-slate-400 italic">No subjects added. Add subjects from the left panel.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer Preview */}
          <div className="mt-auto pt-12">
            {template.footer.showRemarks && (
              <div className="mb-16 text-sm border-2 p-4 rounded-xl bg-slate-50 border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Class Teacher Remarks:</span> 
                <span className="italic text-slate-500 border-b border-dashed border-slate-400 w-full inline-block pb-4">[Backend Remark Data will appear here]</span>
              </div>
            )}
            <div className="flex justify-between items-end px-8 mt-12">
              {template.footer.signatures.map((sig, idx) => (
                <div key={idx} className="w-48 text-center border-t-2 border-slate-800 pt-2 font-bold text-sm uppercase text-slate-700">
                  {sig.trim() || "Signature"}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}