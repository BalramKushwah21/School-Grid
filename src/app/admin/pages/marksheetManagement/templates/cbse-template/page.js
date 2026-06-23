"use client";
import React, { useState } from "react";
import { Settings, Layout, Plus, Trash2, Save, Type, Eye } from "lucide-react";

export default function MarksheetTemplateBuilder() {
  // 🗄️ Master Configuration State (This gets saved to the Database as JSON)
  const [template, setTemplate] = useState({
    id: "tpl_" + Date.now(),
    templateName: "Standard CBSE Yearly",
    themeColor: "#1e3a8a", // Default Blue
    header: {
      showLogo: true,
      schoolName: "Enter School Name",
      address: "Enter School Address",
      affiliation: "Affiliation No: XXXXXX",
    },
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

  // --- Handlers for Dynamic Columns ---
  const addColumn = () => {
    const newCol = { id: `col_${Date.now()}`, label: "New Column", type: "number", key: `custom_${Date.now()}` };
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

  // --- Save to Database ---
  const handleSaveTemplate = () => {
    console.log("Saving Template to DB Payload:", JSON.stringify(template, null, 2));
    alert("✨ Premium Template Saved Successfully! This layout is now ready for data mapping.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {/* =========================================
          LEFT PANEL: Template Control Center
          ========================================= */}
      <div className="w-[400px] bg-white border-r border-slate-200 shadow-xl flex flex-col z-10 h-screen overflow-y-auto">
        <div className="p-6 bg-slate-900 text-white">
          <h1 className="text-xl font-bold flex items-center gap-2"><Layout size={20}/> Template Builder</h1>
          <p className="text-sm text-slate-400 mt-1">Design your school's unique layout</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button onClick={() => setActiveTab("header")} className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === 'header' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>Header</button>
          <button onClick={() => setActiveTab("table")} className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === 'table' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>Marks Table</button>
          <button onClick={() => setActiveTab("footer")} className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === 'footer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>Footer</button>
        </div>

        {/* Controls Content */}
        <div className="p-6 flex-1 space-y-6">
          {activeTab === "header" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Template Internal Name</label>
                <input type="text" value={template.templateName} onChange={(e) => setTemplate({...template, templateName: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">School Name Heading</label>
                <input type="text" value={template.header.schoolName} onChange={(e) => setTemplate({...template, header: {...template.header, schoolName: e.target.value}})} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 ring-blue-500 outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Theme Color</label>
                <input type="color" value={template.themeColor} onChange={(e) => setTemplate({...template, themeColor: e.target.value})} className="w-full h-10 rounded cursor-pointer"/>
              </div>
            </div>
          )}

          {activeTab === "table" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase">Scholastic Columns</label>
                <button onClick={addColumn} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-semibold hover:bg-blue-100"><Plus size={14}/> Add Col</button>
              </div>
              <div className="space-y-3">
                {template.scholasticColumns.map((col, index) => (
                  <div key={col.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 relative group">
                    <button onClick={() => removeColumn(col.id)} className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                    <input type="text" value={col.label} onChange={(e) => updateColumn(col.id, 'label', e.target.value)} className="w-full p-2 mb-2 text-sm font-semibold border rounded shadow-sm outline-none" placeholder="Column Heading (e.g. Term 1)"/>
                    <div className="flex gap-2">
                      <select value={col.type} onChange={(e) => updateColumn(col.id, 'type', e.target.value)} className="flex-1 p-2 text-xs border rounded outline-none bg-white">
                        <option value="text">Subject Name</option>
                        <option value="number">Marks Input</option>
                        <option value="formula">Auto Total</option>
                        <option value="grade">Auto Grade</option>
                      </select>
                      <input type="text" value={col.key} onChange={(e) => updateColumn(col.id, 'key', e.target.value)} className="flex-1 p-2 text-xs border rounded outline-none bg-white font-mono text-indigo-600" placeholder="DB Key Map"/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-xs text-indigo-800 border border-indigo-100">
                <strong>💡 DB Key Map:</strong> This tells the system which database value goes into this column (e.g., typing <code className="bg-white px-1 rounded">math_pt1</code> binds that exam score here).
              </div>
            </div>
          )}

          {activeTab === "footer" && (
            <div className="space-y-4">
               <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={template.footer.showRemarks} onChange={(e) => setTemplate({...template, footer: {...template.footer, showRemarks: e.target.checked}})} className="w-4 h-4 text-blue-600"/>
                    Include Teacher Remarks Section
                  </label>
               </div>
               <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Signature Labels (Comma separated)</label>
                <input type="text" value={template.footer.signatures.join(", ")} onChange={(e) => setTemplate({...template, footer: {...template.footer, signatures: e.target.value.split(", ")}})} className="w-full p-2.5 border rounded-lg text-sm outline-none"/>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="p-4 bg-white border-t border-slate-200">
          <button onClick={handleSaveTemplate} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-all font-semibold shadow-lg">
            <Save size={18}/> Save Template to Database
          </button>
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL: Live A4 Visual Preview
          ========================================= */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-200/50">
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[15mm] flex flex-col relative transition-all duration-300 transform scale-95 origin-top">
          
          {/* Header Preview */}
          <div className="text-center border-b-4 pb-4 mb-6" style={{ borderColor: template.themeColor }}>
            <h1 className="text-4xl font-serif font-bold uppercase tracking-widest" style={{ color: template.themeColor }}>
              {template.header.schoolName || "SCHOOL NAME"}
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-2">{template.header.address || "School Address Line"}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">{template.header.affiliation}</p>
            <div className="mt-4 bg-slate-100 text-slate-800 font-bold px-6 py-1.5 inline-block rounded-full border border-slate-300 text-sm tracking-widest">REPORT CARD PREVIEW</div>
          </div>

          {/* Dummy Student Info Blocks */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="border border-slate-300 p-2 rounded flex"><span className="font-bold w-32 bg-slate-50 px-2 border-r mr-2">Student Name:</span> [Backend Data]</div>
            <div className="border border-slate-300 p-2 rounded flex"><span className="font-bold w-32 bg-slate-50 px-2 border-r mr-2">Roll No:</span> [Backend Data]</div>
            <div className="border border-slate-300 p-2 rounded flex"><span className="font-bold w-32 bg-slate-50 px-2 border-r mr-2">Class & Sec:</span> [Backend Data]</div>
            <div className="border border-slate-300 p-2 rounded flex"><span className="font-bold w-32 bg-slate-50 px-2 border-r mr-2">Date of Birth:</span> [Backend Data]</div>
          </div>

          {/* Dynamic Marks Table Preview */}
          <table className="w-full border-collapse border border-slate-400 text-sm text-center">
            <thead>
              <tr style={{ backgroundColor: template.themeColor, color: '#ffffff' }}>
                {template.scholasticColumns.map((col) => (
                  <th key={col.id} className="border border-slate-400 p-2">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Rendering 3 Mock Rows to show how it will look */}
              {[1, 2, 3].map((row) => (
                <tr key={row} className="border-b border-slate-300">
                  {template.scholasticColumns.map((col) => (
                    <td key={col.id} className={`border border-slate-300 p-2 ${col.type === 'text' ? 'text-left font-semibold text-slate-700' : 'text-slate-400'}`}>
                      {col.type === 'text' ? `Subject ${row}` : col.type === 'formula' ? '[Auto]' : col.type === 'grade' ? 'A' : 'XX'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Preview */}
          <div className="mt-auto pt-12">
            {template.footer.showRemarks && (
              <div className="mb-16 text-sm border p-3 rounded-lg bg-slate-50 border-slate-300">
                <span className="font-bold text-slate-800">Class Teacher Remarks:</span> <span className="italic text-slate-500">[Backend Remark Data will appear here]</span>
              </div>
            )}
            <div className="flex justify-between items-end px-8">
              {template.footer.signatures.map((sig, idx) => (
                <div key={idx} className="w-40 text-center border-t-2 border-slate-800 pt-2 font-bold text-sm uppercase">
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