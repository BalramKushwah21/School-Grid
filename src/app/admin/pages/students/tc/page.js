"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function BulkTransferCertificate() {
  const [filters, setFilters] = useState({ class: '', section: '', rollNo: '' });
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Component Load hote hi saare students ka data fetch karna
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const res = await fetch(`/api/admin/bulk-tc`);
        const result = await res.json();

        if (result.success) {
          setAllStudents(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data from database.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // 2. Real-Time Live Filtering Logic
  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const matchClass = !filters.class || 
        (student.currentClass && student.currentClass.toLowerCase().includes(filters.class.toLowerCase()));
      
      const matchSection = !filters.section || 
        (student.currentClass && student.currentClass.toLowerCase().includes(filters.section.toLowerCase()));

      const matchRollNo = !filters.rollNo || 
        (student.rollNo && student.rollNo.toString().toLowerCase().includes(filters.rollNo.toLowerCase()));

      return matchClass && matchSection && matchRollNo;
    });
  }, [allStudents, filters]);

  const handlePrint = () => {
    window.print();
  };

  // 3. BLANK TEMPLATE (Jab koi data fetch na ho ya match na kare)
  const blankStudent = {
    id: 'blank_template',
    rollNo: '',
    admissionNo: '',
    studentName: '',
    motherName: '',
    fatherName: '',
    nationality: '',
    category: '',
    firstAdmissionDate: '',
    currentClass: '',
    dob: '',
    qualifiedForPromotion: '',
    promotedToClass: '',
    duesPaidUpto: '',
    totalWorkingDays: '',
    daysPresent: '',
    generalConduct: '',
    applicationDate: '',
    issueDate: '',
    reasonForLeaving: '',
    schoolName: 'Patliputra Central School',
    schoolPhone: '',
    photoUrl: null
  };

  // Agar list khali hai, toh blank template dikhayein
  const displayData = filteredStudents.length > 0 ? filteredStudents : [blankStudent];

  // Helper component to render the dotted fill-in-the-blank lines
  const DottedLine = ({ label, value, width = "flex-grow" }) => (
    <div className="flex items-end mb-3 text-sm">
      <span className="mr-2 whitespace-nowrap">{label}</span>
      <span className={`border-b-2 border-dotted border-gray-500 pb-0.5 px-4 font-semibold ${width} text-center uppercase tracking-wide min-h-[24px]`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-serif">
      
      {/* =========================================
          ADMIN CONTROLS (Hidden during Print)
      ========================================= */}
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md my-6 print:hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Bulk Transfer Certificate Generator</h2>
            <p className="text-sm text-gray-500">Live filter students to generate TCs, or print a blank format.</p>
          </div>
          <button 
            onClick={handlePrint}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow transition-all"
          >
            🖨️ Print {filteredStudents.length > 0 ? filteredStudents.length + ' Certificates' : 'Blank Format'}
          </button>
        </div>

        {/* Real-time Filter Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Filter by Class</label>
            <input 
              type="text" 
              name="class" 
              value={filters.class} 
              onChange={handleInputChange} 
              placeholder="e.g. 10" 
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Filter by Section</label>
            <input 
              type="text" 
              name="section" 
              value={filters.section} 
              onChange={handleInputChange} 
              placeholder="e.g. A" 
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Search Roll No</label>
            <input 
              type="text" 
              name="rollNo" 
              value={filters.rollNo} 
              onChange={handleInputChange} 
              placeholder="Specific Student ID/Roll" 
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>
        
        {loading && <p className="text-blue-600 mt-4 font-bold text-sm animate-pulse">Loading all student records from database...</p>}
        {error && <p className="text-red-600 mt-4 font-bold text-sm">{error}</p>}
        
        {!loading && filteredStudents.length === 0 && !error && (
          <p className="text-amber-600 mt-4 font-bold text-sm">No students match your filter. Showing blank template below.</p>
        )}
      </div>

      {/* =========================================
          PRINTABLE TC FORMAT (Batch Rendering)
      ========================================= */}
      <div className="print:w-full print:bg-white print:m-0 print:p-0">
        {displayData.map((student) => (
          <div 
            key={student.id} 
            className="max-w-4xl mx-auto bg-white p-10 mb-8 border-4 border-double border-gray-800 shadow-xl print:shadow-none print:border-0 print:m-0 print:p-8 print:w-[210mm] print:h-[297mm] print:page-break-after-always relative box-border"
          >
            
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Affiliation No - 330406</span>
                <span>School Code: - 65399</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-wider">
                Patliputra Central School
              </h1>
              <p className="text-sm font-semibold text-gray-700">Parbatta (Khagaria), Pin Code - 851216</p>
              <p className="text-sm font-semibold text-gray-700">Affiliated to CBSE New Delhi 10+2</p>
              <div className="flex justify-between text-xs font-semibold mt-4 border-b border-gray-400 pb-2">
                <span>Website: www.pcs1.org</span>
                <span>Email: directorjpsingh@gmail.com</span>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <span className="bg-gray-800 text-white px-6 py-1 text-lg font-bold uppercase tracking-widest">
                Transfer Certificate
              </span>
            </div>

            {/* Meta Data */}
            <div className="flex justify-between font-bold text-sm mb-6">
              <span>Roll No.- <span className="border-b-2 border-dotted border-gray-500 pb-0.5 px-4 min-w-[50px] inline-block text-center">{student.rollNo}</span></span>
              <span>Book No. <span className="border-b-2 border-dotted border-gray-500 pb-0.5 px-4 min-w-[50px] inline-block text-center">001</span></span>
              <span>Admission No. <span className="border-b-2 border-dotted border-gray-500 pb-0.5 px-4 min-w-[50px] inline-block text-center">{student.admissionNo}</span></span>
            </div>

            {/* 22 Point Data List mapping from Image */}
            <div className="space-y-1">
              <DottedLine label="1. Name of Pupil" value={student.studentName} />
              <DottedLine label="2. Mother's Name" value={student.motherName} />
              <DottedLine label="3. Father's Name" value={student.fatherName} />
              <DottedLine label="4. Nationality" value={student.nationality} width="w-1/2" />
              <DottedLine label="5. Whether the candidate belongs to GEN/SC/ST/OBC" value={student.category} />
              
              <div className="flex items-end mb-3 text-sm">
                <span className="mr-2">6. Date of first admission in the school with class</span>
                <span className="border-b-2 border-dotted border-gray-500 pb-0.5 px-4 font-semibold text-center uppercase w-1/3 min-h-[24px]">{student.firstAdmissionDate}</span>
                <span className="mx-2">Class:</span>
                <span className="border-b-2 border-dotted border-gray-500 pb-0.5 px-4 font-semibold text-center uppercase w-1/4 min-h-[24px]">{student.currentClass}</span>
              </div>

              <DottedLine label="7. Date of Birth according to Admission Register (in figures)" value={student.dob} />
              <DottedLine label="8. Class in which the pupil last studied (in figure)" value={student.currentClass} />
              <DottedLine label="9. School/Board Annual Examination last taken with result" value={student.id === 'blank_template' ? '' : 'AISSE - 2026 PASS'} />
              <DottedLine label="10. Subjects Studied : 1. English 2. Hindi 3. Maths 4. Science 5. SST" value="" />
              
              <div className="flex items-end mb-3 text-sm">
                <span className="mr-2">11. Whether qualified for promotion to the higher class</span>
                <span className="border-b-2 border-dotted border-gray-500 pb-0.5 px-4 font-semibold text-center uppercase w-24 min-h-[24px]">{student.qualifiedForPromotion}</span>
                <span className="mx-2">if so, to which class</span>
                <span className="border-b-2 border-dotted border-gray-500 pb-0.5 px-4 font-semibold text-center uppercase flex-grow min-h-[24px]">{student.promotedToClass}</span>
              </div>

              <DottedLine label="12. Month upto which the school dues paid" value={student.duesPaidUpto} />
              <DottedLine label="13. Any fee concession availed of" value={student.id === 'blank_template' ? '' : 'No'} />
              <DottedLine label="14. Total No. of working days" value={student.totalWorkingDays} width="w-1/3" />
              <DottedLine label="15. Total No. of working days present" value={student.daysPresent} width="w-1/3" />
              <DottedLine label="16. Whether NCC Cadet/Boy Scout/Girl Guide" value="" />
              <DottedLine label="17. Games played or extra-curricular activities" value={student.id === 'blank_template' ? '' : 'Good'} />
              <DottedLine label="18. General conduct" value={student.generalConduct} />
              <DottedLine label="19. Date of application for certificate" value={student.applicationDate} width="w-1/3" />
              <DottedLine label="20. Date of issue of certificate" value={student.issueDate} width="w-1/3" />
              <DottedLine label="21. Reasons for leaving the school" value={student.reasonForLeaving} />
              <DottedLine label="22. Any other remarks" value={student.id === 'blank_template' ? '' : 'NIL'} />
            </div>

            {/* Footer Signatures */}
            <div className="mt-20 flex justify-between items-end text-sm font-bold">
              <div className="text-center">
                <div className="w-40 border-t border-gray-800 pt-1 mb-1"></div>
                <p>Class Teacher</p>
              </div>
              <div className="text-center">
                <div className="w-40 border-t border-gray-800 pt-1 mb-1"></div>
                <p>Checked by L.D.C.</p>
              </div>
              <div className="text-center">
                <div className="w-40 border-t border-gray-800 pt-1 mb-1"></div>
                <p>PRINCIPAL</p>
                <p className="text-xs font-normal">Seal</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}