"use client"

import React, { useState } from 'react';

export default function App() {
  // 1. Core State for Alumni Student Record
  const [alumniData, setAlumniData] = useState({
    alumniId: 'ALM-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    fullName: '',
    enrollmentNo: '',
    graduationYear: '2026',
    streamBranch: 'Science & Technology',
    academicAward: 'First Class with Distinction',
    currentStatus: 'Employed',
    currentOrganization: '',
    email: '',
    membershipType: 'Life Member'
  });

  const [theme, setTheme] = useState('midnight'); // Options: midnight, emerald, burgundy
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [registryLogs, setRegistryLogs] = useState([]); // Simulated local DB registry view

  // 2. Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlumniData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Database Simulation (POST API Trigger)
  const handleSyncDatabase = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock API Delay
    setTimeout(() => {
      setLoading(false);
      setIsSaved(true);
      // Append current alumni entry to log history to show the DB works!
      setRegistryLogs((prev) => [
        {
          id: alumniData.alumniId,
          name: alumniData.fullName,
          year: alumniData.graduationYear,
          stream: alumniData.streamBranch,
          type: alumniData.membershipType,
          date: new Date().toLocaleDateString()
        },
        ...prev
      ]);
    }, 1200);
  };

  // 4. Download / Print PDF trigger
  const handlePrintCertificate = () => {
    window.print();
  };

  // Theme styling definitions for the dynamic certificate frame
  const themes = {
    midnight: {
      border: 'border-slate-800',
      accentText: 'text-sky-800',
      accentBg: 'bg-slate-900',
      sealColor: 'border-amber-500 text-amber-600',
      badgeColor: 'bg-slate-50 border-slate-200'
    },
    emerald: {
      border: 'border-emerald-800',
      accentText: 'text-emerald-800',
      accentBg: 'bg-emerald-800',
      sealColor: 'border-yellow-600 text-yellow-600',
      badgeColor: 'bg-emerald-50/50 border-emerald-100'
    },
    burgundy: {
      border: 'border-rose-900',
      accentText: 'text-rose-800',
      accentBg: 'bg-rose-950',
      sealColor: 'border-amber-500 text-amber-600',
      badgeColor: 'bg-rose-50/50 border-rose-100'
    }
  };

  const activeTheme = themes[theme];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Alumni Relations Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Register graduated students and generate official lifetime membership certifications.</p>
          </div>
          
          {/* Theme Quick Changer */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Style Theme:</span>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setTheme('midnight')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${theme === 'midnight' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                Midnight
              </button>
              <button 
                onClick={() => setTheme('emerald')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${theme === 'emerald' ? 'bg-emerald-800 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                Emerald
              </button>
              <button 
                onClick={() => setTheme('burgundy')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${theme === 'burgundy' ? 'bg-rose-800 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                Burgundy
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Panel */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ==========================================
           1. ALUMNI REGISTRATION FORM (LEFT)
           ========================================== */}
        <section className="lg:col-span-5 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              Alumni Registration Form
            </h2>

            <form onSubmit={handleSyncDatabase} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Student Name</label>
                <input 
                  type="text" name="fullName" required value={alumniData.fullName} onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" placeholder="e.g. David Miller"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Enrollment/Roll No.</label>
                  <input 
                    type="text" name="enrollmentNo" required value={alumniData.enrollmentNo} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" placeholder="e.g. EN-88301"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Graduation Year</label>
                  <select 
                    name="graduationYear" value={alumniData.graduationYear} onChange={handleInputChange}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Academic Stream/Branch</label>
                <input 
                  type="text" name="streamBranch" required value={alumniData.streamBranch} onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" placeholder="e.g. Science & Technology"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Academic Award / Distinction</label>
                <input 
                  type="text" name="academicAward" value={alumniData.academicAward} onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" placeholder="e.g. First Class Honours"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Status</label>
                  <select 
                    name="currentStatus" value={alumniData.currentStatus} onChange={handleInputChange}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Employed">Employed</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Higher Studies">Higher Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Membership Tier</label>
                  <select 
                    name="membershipType" value={alumniData.membershipType} onChange={handleInputChange}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Life Member">Life Member</option>
                    <option value="Executive Alumni">Executive Alumni</option>
                    <option value="Honorary Patron">Honorary Patron</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Org / Company / Uni</label>
                <input 
                  type="text" name="currentOrganization" value={alumniData.currentOrganization} onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" placeholder="e.g. TechCorp, Stanford"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Email</label>
                <input 
                  type="email" name="email" required value={alumniData.email} onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" placeholder="e.g. david@alumni.org"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white p-3 font-semibold rounded-lg transition text-sm shadow disabled:bg-indigo-300"
              >
                {loading ? 'Syncing to Database...' : 'Register Alumni Member'}
              </button>
            </form>
          </div>

          {/* SIMULATED SYSTEM DB SYNC LOG */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Database Connection Log</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {registryLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No alumni records saved in the current session yet.</p>
              ) : (
                registryLogs.map((log) => (
                  <div key={log.id} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{log.name}</p>
                      <p className="text-[10px] text-slate-500">{log.stream} ({log.year})</p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">{log.type}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ==========================================
           2. CERTIFICATE CANVAS PREVIEW & DOWNLOAD (RIGHT)
           ========================================== */}
        <section className="lg:col-span-7 flex flex-col items-center print:w-full print:p-0">
          
          {/* Action Header Panel */}
          <div className="w-full max-w-2xl mb-4 bg-slate-900 text-white p-4 rounded-xl shadow-md flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSaved ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="text-xs font-semibold tracking-wide">
                {isSaved ? `Connected ID: ${alumniData.alumniId}` : "Unsynced Document Draft"}
              </span>
            </div>
            
            <button 
              onClick={handlePrintCertificate}
              disabled={!isSaved}
              className={`px-5 py-2 text-xs font-extrabold rounded-lg shadow-lg transition-all ${
                isSaved 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Print / Save Certificate PDF
            </button>
          </div>

          {/* Certificate Layout Paper (Golden Ratio Border) */}
          <div className={`w-full max-w-2xl bg-white p-12 border-[12px] border-double ${activeTheme.border} shadow-2xl rounded-sm aspect-[1/1.41] relative flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:m-0 print:w-full`}>
            
            {/* Top Border Accents */}
            <div className="absolute top-4 left-4 right-4 bottom-4 border border-slate-200 pointer-events-none print:hidden"></div>

            {/* School Header */}
            <div className="text-center">
              <h1 className="text-3xl font-extrabold uppercase tracking-widest text-slate-900">EXCEL ACADEMY</h1>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">Universal Registry of Alumni Excellence</p>
              
              <div className="w-32 h-[2px] bg-slate-800 mx-auto mt-4"></div>
            </div>

            {/* Document Title Banner */}
            <div className="text-center my-6">
              <h3 className="text-xl font-serif italic text-slate-700 mb-1">Certificate of Enrollment & Alumni Status</h3>
              <p className="text-xs text-slate-400 tracking-wider">This credential acts as legal testimony of academic graduation.</p>
            </div>

            {/* Dynamic Statement Structure */}
            <div className="space-y-6 text-sm text-slate-800 leading-relaxed text-center px-4">
              <p className="font-serif italic text-slate-500">This certificate is proudly awarded to</p>
              
              <p className="text-2xl font-bold uppercase tracking-wide border-b border-slate-300 py-1 inline-block min-w-[280px]">
                {alumniData.fullName || "STUDENT NAME"}
              </p>
              
              <p className="max-w-md mx-auto leading-loose">
                who has successfully met all mandatory scholastic milestones and earned their degree in 
                <span className="font-bold block text-base text-slate-900 mt-1">{alumniData.streamBranch || "SCHOLASTIC STREAM"}</span>
                with the academic honor of 
                <span className={`font-semibold italic underline ${activeTheme.accentText}`}>{alumniData.academicAward || "First Class Merit"}
                  </span> during the Year of 
                  <span className="font-bold text-slate-900">{alumniData.graduationYear}</span>.
              </p>

              <p className="max-w-md mx-auto text-xs text-slate-500 mt-2">
                As a registered alumnus, they hold the official distinction of <span className="font-bold uppercase text-amber-600">{alumniData.membershipType}</span> and have verified their record under database serial locator <span className="font-mono font-bold tracking-tight text-slate-800">{alumniData.alumniId}</span>.
              </p>
            </div>

            {/* Graphic Badge & Stamp section */}
            <div className="flex justify-between items-center mt-12 px-6">
              {/* Left Sign */}
              <div className="text-center">
                <div className="w-24 border-t border-slate-400 mx-auto mb-1"></div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Dean of Students</span>
              </div>

              {/* Central Seal Graphic */}
              <div className={`w-20 h-20 rounded-full border-4 ${activeTheme.sealColor.split(' ')[0]}/40 flex items-center justify-center p-1 bg-white relative shadow-inner`}>
                <div className={`w-full h-full rounded-full border border-dashed ${activeTheme.sealColor.split(' ')[0]}/60 flex flex-col items-center justify-center text-center`}>
                  <span className={`text-[9px] font-black tracking-widest ${activeTheme.sealColor.split(' ')[1]}`}>SEAL</span>
                  <span className={`text-[7px] uppercase font-bold ${activeTheme.sealColor.split(' ')[1]}`}>{alumniData.graduationYear}</span>
                </div>
              </div>

              {/* Right Sign */}
              <div className="text-center">
                <div className="w-24 border-t border-slate-400 mx-auto mb-1"></div>
                <span className="text-[10px] uppercase font-bold text-slate-400">President, Alumni</span>
              </div>
            </div>

            {/* Official Certification Footer Tag */}
            <div className="text-center mt-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Excel Academy Digital Network Certificate Verified
            </div>

          </div>

        </section>

      </main>
      
    </div>
  );
}