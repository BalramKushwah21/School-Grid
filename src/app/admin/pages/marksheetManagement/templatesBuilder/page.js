"use client";
import React, { useState, useEffect } from "react";
import { Printer, Download, Search, CheckCircle } from "lucide-react";

export default function MarksheetGenerationEngine() {
  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Mock DB Fetch: The saved template configuration from Page 1
  const savedTemplateConfig = {
    themeColor: "#1e3a8a",
    header: { schoolName: "Delhi Public School", address: "Sector 12, R.K Puram, New Delhi", affiliation: "Affiliation No: 2730001" },
    scholasticColumns: [
      { id: "col_1", label: "Subject", type: "text", key: "subjectName" },
      { id: "col_2", label: "PT 1 (20)", type: "number", key: "pt1" },
      { id: "col_3", label: "Term 1 (80)", type: "number", key: "term1" },
      { id: "col_4", label: "Total (100)", type: "formula", formula: "pt1+term1" },
      { id: "col_5", label: "Grade", type: "grade" }
    ],
    footer: { showRemarks: true, signatures: ["Teacher", "Principal"] }
  };

  // 2. Mock DB Fetch: Actual Student Records mapped to those keys
  const studentDataRecords = [
    {
      studentInfo: { name: "Rahul Sharma", rollNo: "45", class: "10th - A", dob: "15-Aug-2008" },
      remarks: "Excellent progress in science.",
      marks: [
        { subjectName: "ENGLISH", pt1: 18, term1: 72 },
        { subjectName: "MATHEMATICS", pt1: 19, term1: 76 },
        { subjectName: "SCIENCE", pt1: 17, term1: 75 },
      ]
    },
    {
      studentInfo: { name: "Priya Singh", rollNo: "46", class: "10th - A", dob: "22-Nov-2008" },
      remarks: "Needs to focus more on Mathematics.",
      marks: [
        { subjectName: "ENGLISH", pt1: 16, term1: 68 },
        { subjectName: "MATHEMATICS", pt1: 14, term1: 58 },
        { subjectName: "SCIENCE", pt1: 18, term1: 78 },
      ]
    }
  ];

  // Helper Logic to Calculate Formulas and Grades dynamically
  const calculateTotal = (markObj, formula) => {
    // Basic parser for "pt1+term1"
    const keys = formula.split('+');
    let total = 0;
    keys.forEach(k => { total += (Number(markObj[k.trim()]) || 0); });
    return total;
  };

  const calculateGrade = (totalMarks) => {
    if (totalMarks >= 91) return "A1";
    if (totalMarks >= 81) return "A2";
    if (totalMarks >= 71) return "B1";
    if (totalMarks >= 61) return "B2";
    return "C";
  };

  return (
    <div className="bg-slate-100 min-h-screen p-8">
      
      {/* Action Bar - Hidden during actual print */}
      <div className="print:hidden max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-sm mb-8 flex justify-between items-center border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bulk Marksheet Generation Engine</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
            <CheckCircle size={14} className="text-emerald-500"/>
            Successfully mapped <strong>{studentDataRecords.length} students</strong> to <strong>{savedTemplateConfig.header.schoolName} Template</strong>
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition flex items-center gap-2">
            <Download size={18}/> Export PDFs
          </button>
          <button onClick={() => window.print()} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2">
            <Printer size={18}/> Print Batch Now
          </button>
        </div>
      </div>

      {/* Generation Area - Maps through every student and generates their unique A4 page */}
      <div className="flex flex-col items-center gap-8 print:gap-0">
        {studentDataRecords.map((student, s_idx) => (
          
          <div key={s_idx} className="w-[210mm] h-[297mm] bg-white shadow-2xl p-[15mm] print:shadow-none print:m-0 print:border-none relative break-after-page">
            
            {/* Header Mapped */}
            <div className="text-center border-b-4 pb-4 mb-6" style={{ borderColor: savedTemplateConfig.themeColor }}>
              <h1 className="text-4xl font-serif font-bold uppercase tracking-widest" style={{ color: savedTemplateConfig.themeColor }}>
                {savedTemplateConfig.header.schoolName}
              </h1>
              <p className="text-sm font-medium text-slate-600 mt-2">{savedTemplateConfig.header.address}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">{savedTemplateConfig.header.affiliation}</p>
              <div className="mt-4 bg-slate-100 text-slate-800 font-bold px-6 py-1.5 inline-block rounded-full border border-slate-300 text-sm tracking-widest">ACADEMIC REPORT CARD</div>
            </div>

            {/* Profile Mapped */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-8 text-sm">
              <div className="border-b border-slate-200 pb-1 flex justify-between"><span className="font-bold text-slate-600">Student Name:</span> <span className="font-bold text-slate-900 uppercase">{student.studentInfo.name}</span></div>
              <div className="border-b border-slate-200 pb-1 flex justify-between"><span className="font-bold text-slate-600">Roll No:</span> <span className="font-semibold text-slate-900">{student.studentInfo.rollNo}</span></div>
              <div className="border-b border-slate-200 pb-1 flex justify-between"><span className="font-bold text-slate-600">Class & Section:</span> <span className="font-semibold text-slate-900">{student.studentInfo.class}</span></div>
              <div className="border-b border-slate-200 pb-1 flex justify-between"><span className="font-bold text-slate-600">Date of Birth:</span> <span className="font-semibold text-slate-900">{student.studentInfo.dob}</span></div>
            </div>

            {/* Marks Table Dynamically Mapped based on Template Columns */}
            <table className="w-full border-collapse border-2 border-slate-800 text-sm text-center mb-8">
              <thead>
                <tr style={{ backgroundColor: savedTemplateConfig.themeColor, color: '#ffffff' }}>
                  {savedTemplateConfig.scholasticColumns.map((col) => (
                    <th key={col.id} className="border border-slate-400 p-2.5 font-bold uppercase text-xs">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {student.marks.map((markRow, m_idx) => {
                  
                  // Calculate row total purely for grading logic if formula exists
                  const formulaCol = savedTemplateConfig.scholasticColumns.find(c => c.type === 'formula');
                  const rowTotal = formulaCol ? calculateTotal(markRow, formulaCol.formula) : 0;

                  return (
                    <tr key={m_idx} className="border-b border-slate-400">
                      {savedTemplateConfig.scholasticColumns.map((col) => {
                        let cellValue = "";
                        
                        // Intelligent Data Rendering based on configured column type
                        if (col.type === 'text') cellValue = <span className="font-bold text-slate-800">{markRow[col.key]}</span>;
                        else if (col.type === 'number') cellValue = markRow[col.key] || "-";
                        else if (col.type === 'formula') cellValue = <span className="font-bold">{calculateTotal(markRow, col.formula)}</span>;
                        else if (col.type === 'grade') cellValue = <span className="font-bold text-emerald-600">{calculateGrade(rowTotal)}</span>;

                        return <td key={col.id} className={`border border-slate-400 p-2 ${col.type === 'text' ? 'text-left pl-4' : ''}`}>{cellValue}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer Mapped */}
            <div className="mt-auto absolute bottom-[15mm] left-[15mm] right-[15mm]">
              {savedTemplateConfig.footer.showRemarks && (
                <div className="mb-20 text-sm p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Class Teacher Remarks:</span>
                  <span className="italic text-slate-700">"{student.remarks}"</span>
                </div>
              )}
              <div className="flex justify-between items-end px-8">
                {savedTemplateConfig.footer.signatures.map((sig, idx) => (
                  <div key={idx} className="w-40 text-center border-t border-slate-400 pt-2 font-bold text-sm text-slate-600 uppercase tracking-wider">
                    {sig}
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}