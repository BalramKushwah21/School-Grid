"use client"
import React, { useState } from 'react';

const EditableReportCard = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Editable state for the report card
  const [reportData, setReportData] = useState({
    schoolName: 'Global Excellence Academy',
    schoolAddress: '123 Education Lane, Knowledge City',
    studentName: 'Aarav Sharma',
    rollNo: '10A-01',
    class: 'Class 10 - A',
    examType: 'Mid-Term Examination',
    academicYear: '2026-2027',
    attendance: '95%',
    remarks: 'Aarav is an outstanding student with excellent analytical skills.',
    subjects: [
      { id: 1, name: 'Mathematics', maxMarks: 100, marksObtained: 85, grade: 'A', gradePoint: '3.6' },
      { id: 2, name: 'Science', maxMarks: 100, marksObtained: 92, grade: 'A+', gradePoint: '4.0' },
      { id: 3, name: 'English', maxMarks: 100, marksObtained: 78, grade: 'B+', gradePoint: '3.2' },
      { id: 4, name: 'Social Studies', maxMarks: 100, marksObtained: 81, grade: 'A', gradePoint: '3.6' },
      { id: 5, name: 'Computer Science', maxMarks: 100, marksObtained: 95, grade: 'A+', gradePoint: '4.0' }
    ]
  });

  // Handle changes to top-level student info
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  // Handle changes to specific subject marks
  const handleSubjectChange = (id, field, value) => {
    const updatedSubjects = reportData.subjects.map(sub => {
      if (sub.id === id) {
        return { ...sub, [field]: field === 'marksObtained' ? Number(value) : value };
      }
      return sub;
    });
    setReportData({ ...reportData, subjects: updatedSubjects });
  };

  // Derived Calculations (Auto-updates when marks change)
  const totalObtained = reportData.subjects.reduce((sum, sub) => sum + sub.marksObtained, 0);
  const totalMaxMarks = reportData.subjects.reduce((sum, sub) => sum + sub.maxMarks, 0);
  const percentage = totalMaxMarks > 0 ? ((totalObtained / totalMaxMarks) * 100).toFixed(2) : 0;
  const cgpa = reportData.subjects.length > 0 
    ? (reportData.subjects.reduce((sum, sub) => sum + parseFloat(sub.gradePoint || 0), 0) / reportData.subjects.length).toFixed(2) 
    : 0;

  const handlePrint = () => {
    setIsEditing(false); // Ensure we aren't printing input boxes
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center print:p-0 print:bg-white">
      <div className="w-full max-w-4xl bg-white shadow-lg border border-gray-300 p-8 print:shadow-none print:border-none print:p-4">
        
        {/* ACTION BAR (Hidden on Print) */}
        <div className="flex justify-end space-x-4 mb-6 print:hidden">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white font-medium py-2 px-6 rounded-md transition duration-150 shadow-sm`}
          >
            {isEditing ? 'Save & Lock View' : 'Edit Report Card'}
          </button>
          
          <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition duration-150 flex items-center shadow-sm"
          >
            Print
          </button>
        </div>

        {/* HEADER SECTION */}
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">{reportData.schoolName}</h1>
          <p className="text-gray-600 mt-1">{reportData.schoolAddress}</p>
          <div className="mt-4 inline-block bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-widest uppercase">
            {reportData.examType} - {reportData.academicYear}
          </div>
        </div>

        {/* STUDENT INFO SECTION */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-700">Student Name:</span> 
            {isEditing ? (
              <input type="text" name="studentName" value={reportData.studentName} onChange={handleInfoChange} className="border p-1 rounded w-full focus:ring-blue-500" />
            ) : (<span className="font-medium text-gray-900">{reportData.studentName}</span>)}
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-700">Roll No:</span> 
            {isEditing ? (
              <input type="text" name="rollNo" value={reportData.rollNo} onChange={handleInfoChange} className="border p-1 rounded w-full focus:ring-blue-500" />
            ) : (<span className="font-medium text-gray-900">{reportData.rollNo}</span>)}
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-700">Class & Sec:</span> 
            {isEditing ? (
              <input type="text" name="class" value={reportData.class} onChange={handleInfoChange} className="border p-1 rounded w-full focus:ring-blue-500" />
            ) : (<span className="font-medium text-gray-900">{reportData.class}</span>)}
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-700">Attendance:</span> 
            {isEditing ? (
              <input type="text" name="attendance" value={reportData.attendance} onChange={handleInfoChange} className="border p-1 rounded w-full focus:ring-blue-500" />
            ) : (<span className="font-medium text-gray-900">{reportData.attendance}</span>)}
          </div>
        </div>

        {/* MARKS TABLE */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100 text-gray-800 text-sm uppercase tracking-wider">
                <th className="p-3 border border-gray-400 font-semibold w-12 text-center">#</th>
                <th className="p-3 border border-gray-400 font-semibold">Subject</th>
                <th className="p-3 border border-gray-400 font-semibold text-center w-28">Max Marks</th>
                <th className="p-3 border border-gray-400 font-semibold text-center w-32">Obtained</th>
                <th className="p-3 border border-gray-400 font-semibold text-center w-24">Grade</th>
                <th className="p-3 border border-gray-400 font-semibold text-center w-24">GP</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {reportData.subjects.map((subject, index) => (
                <tr key={subject.id}>
                  <td className="p-3 border border-gray-400 text-center">{index + 1}</td>
                  <td className="p-3 border border-gray-400 font-medium">{subject.name}</td>
                  <td className="p-3 border border-gray-400 text-center">{subject.maxMarks}</td>
                  
                  {/* EDITABLE MARKS */}
                  <td className="p-3 border border-gray-400 text-center font-semibold bg-blue-50">
                    {isEditing ? (
                      <input type="number" value={subject.marksObtained} onChange={(e) => handleSubjectChange(subject.id, 'marksObtained', e.target.value)} className="w-full text-center border p-1 rounded focus:ring-blue-500" />
                    ) : (subject.marksObtained)}
                  </td>
                  
                  {/* EDITABLE GRADE */}
                  <td className="p-3 border border-gray-400 text-center font-bold text-gray-900">
                    {isEditing ? (
                      <input type="text" value={subject.grade} onChange={(e) => handleSubjectChange(subject.id, 'grade', e.target.value)} className="w-full text-center border p-1 rounded focus:ring-blue-500" />
                    ) : (subject.grade)}
                  </td>
                  
                  {/* EDITABLE GRADE POINT */}
                  <td className="p-3 border border-gray-400 text-center">
                    {isEditing ? (
                      <input type="number" step="0.1" value={subject.gradePoint} onChange={(e) => handleSubjectChange(subject.id, 'gradePoint', e.target.value)} className="w-full text-center border p-1 rounded focus:ring-blue-500" />
                    ) : (subject.gradePoint)}
                  </td>
                </tr>
              ))}
              
              {/* TOTALS ROW */}
              <tr className="bg-gray-50 font-bold">
                <td colSpan="2" className="p-3 border border-gray-400 text-right uppercase">Grand Total</td>
                <td className="p-3 border border-gray-400 text-center">{totalMaxMarks}</td>
                <td className="p-3 border border-gray-400 text-center text-blue-700">{totalObtained}</td>
                <td colSpan="2" className="p-3 border border-gray-400 bg-white"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SUMMARY & REMARKS */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="border border-gray-400 p-4 rounded-sm bg-gray-50">
            <h3 className="font-semibold text-gray-800 uppercase text-xs tracking-wider mb-3 border-b border-gray-300 pb-2">Academic Summary</h3>
            <div className="flex justify-between mb-2"><span className="text-gray-600">Overall Percentage:</span> <span className="font-bold text-gray-900">{percentage}%</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Cumulative GPA:</span> <span className="font-bold text-gray-900">{cgpa}</span></div>
          </div>
          
          <div className="border border-gray-400 p-4 rounded-sm">
            <h3 className="font-semibold text-gray-800 uppercase text-xs tracking-wider mb-2">Class Teacher Remarks</h3>
            {isEditing ? (
              <textarea name="remarks" value={reportData.remarks} onChange={handleInfoChange} className="w-full border p-2 rounded text-sm focus:ring-blue-500" rows="3" />
            ) : (
              <p className="text-gray-700 text-sm italic">"{reportData.remarks}"</p>
            )}
          </div>
        </div>

        {/* SIGNATURE BLOCKS */}
        <div className="grid grid-cols-3 gap-4 mt-16 pt-8 text-center text-sm font-medium text-gray-700">
          <div><div className="border-t border-gray-800 w-40 mx-auto pt-2">Parent/Guardian</div></div>
          <div><div className="border-t border-gray-800 w-40 mx-auto pt-2">Class Teacher</div></div>
          <div><div className="border-t border-gray-800 w-40 mx-auto pt-2">Principal</div></div>
        </div>

      </div>
    </div>
  );
};

export default EditableReportCard;