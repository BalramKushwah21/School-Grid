"use client"
import React, { useState, useMemo } from 'react';

// Pre-populated classes data
const CLASSES = [
  { id: "CLS-9A", name: "Grade 9-A" },
  { id: "CLS-10A", name: "Grade 10-A" },
  { id: "CLS-11A", name: "Grade 11-A" },
  { id: "CLS-12A", name: "Grade 12-A" }
];

const SUBJECTS = [
  "Mathematics", "Calculus", "Physics", "Chemistry", "AP English Literature", "World History", "Computer Science"
];

const TEACHERS = [
  { id: "TCH-101", name: "Dr. Sarah Jenkins", dept: "Science" },
  { id: "TCH-102", name: "Marcus Aurelius Vance", dept: "Mathematics" },
  { id: "TCH-103", name: "Elena Rostova", dept: "Languages" },
  { id: "TCH-104", name: "Raymond Reddington", dept: "Social Studies" },
  { id: "TCH-105", name: "Dr. Jane Foster", dept: "Engineering" }
];

const INITIAL_LESSON_PLANS = [
  {
    id: "LPN-4091",
    title: "Introduction to Quantum Electrodynamics",
    classId: "CLS-12A",
    subject: "Physics",
    teacherId: "TCH-101",
    weekNumber: 12,
    objectives: [
      "Understand the basic principles of light-matter interaction.",
      "Calculate probability amplitudes for simple electron-photon Feynman diagrams.",
      "Define basic renormalized charge parameters."
    ],
    duration: "60 Minutes",
    materialsNeeded: "Projector, Feynman Diagram handouts, Online simulation tool.",
    phases: [
      { step: "Warm-up (10 mins)", activity: "Quick recap on quantum superposition and wave-particle duality." },
      { step: "Direct Instruction (25 mins)", activity: "Introduce probability amplitudes, vertex factors, and electron-photon propagation vectors on board." },
      { step: "Guided Practice (15 mins)", activity: "Students sketch basic tree-level Feynman diagrams in pairs." },
      { step: "Independent Assessment (10 mins)", activity: "Exit ticket: Write down vertex variables for a basic scattering equation." }
    ],
    assessmentMethod: "Exit Ticket and in-class diagram drafting assessment.",
    status: "Pending", // Pending, Approved, Needs Revision
    remarks: ""
  },
  {
    id: "LPN-8821",
    title: "Understanding derivatives via limits",
    classId: "CLS-11A",
    subject: "Calculus",
    teacherId: "TCH-102",
    weekNumber: 14,
    objectives: [
      "Define a derivative as the limit of a difference quotient.",
      "Graphically interpret the slope of tangent lines.",
      "Solve derivatives for linear and quadratic variables using first principles."
    ],
    duration: "50 Minutes",
    materialsNeeded: "Graphing calculators, grid sheets, smartboard display.",
    phases: [
      { step: "Introduction (10 mins)", activity: "Explore average rate of change on a secant line between two graph coordinates." },
      { step: "Direct Instruction (20 mins)", activity: "Present formal limit definition of f'(x). Step-by-step algebra derivation." },
      { step: "Guided Group Work (15 mins)", activity: "Students use limit properties to solve tangent equations on worksheets." },
      { step: "Closing (5 mins)", activity: "Reflective discussion on tangent slope as interval becomes infinitesimal." }
    ],
    assessmentMethod: "Formative checklist during guided worksheet solve session.",
    status: "Approved",
    remarks: "Excellent pacing and clear transition from secant to tangent geometry."
  },
  {
    id: "LPN-3012",
    title: "Rhetorical Devices in Hamlet Act III",
    classId: "CLS-10A",
    subject: "AP English Literature",
    teacherId: "TCH-103",
    weekNumber: 13,
    objectives: [
      "Analyze Hamlet's famous 'To be or not to be' soliloquy for dramatic irony.",
      "Differentiate between antithesis, synecdoche, and standard metaphor.",
      "Compose a paragraph analyzing text parameters of existential dread."
    ],
    duration: "90 Minutes",
    materialsNeeded: "Hamlet Text, Folger digital editions, Rhetorical devices reference sheets.",
    phases: [
      { step: "Intro / Reading (20 mins)", activity: "Read the Act III Soliloquy aloud. Perform textual highlight rounds." },
      { step: "Instruction (30 mins)", activity: "Break down synecdoche, metonymy, and parallel structural rhythms in Shakespearean prose." },
      { step: "Collaborative Breakout (25 mins)", activity: "Small group dialectical grid alignment. Identify 4 distinct rhetorical strategies used." },
      { step: "Individual Assignment (15 mins)", activity: "Draft analytical argument paragraph." }
    ],
    assessmentMethod: "Paragraph analysis rubric assessment.",
    status: "Needs Revision",
    remarks: "The 90-minute structure looks slightly dense. Please add a 5-minute break or brief transition exercise to keep students engaged."
  }
];

export default function App() {
  const [plans, setPlans] = useState(INITIAL_LESSON_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState(INITIAL_LESSON_PLANS[0].id);
  const [selectedClassId, setSelectedClassId] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Syllabus Directive Form State
  const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    classId: CLASSES[0].id,
    subject: SUBJECTS[0],
    teacherId: TEACHERS[0].id,
    weekNumber: 1,
    objectives: ''
  });

  // Admin Audit Inputs
  const [adminRemark, setAdminRemark] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [dbLogs, setDbLogs] = useState([
    { id: "SYS-721", action: "BOOT_SUCCESS", details: "Lesson audit kernel loaded.", timestamp: "08:15 AM" }
  ]);

  const triggerNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  // Safe selection wrapper
  const activePlan = useMemo(() => {
    if (!selectedPlanId) return null;
    return plans.find(p => p.id === selectedPlanId) || null;
  }, [plans, selectedPlanId]);

  // Derived Analytics stats for Admin cockpit
  const metrics = useMemo(() => {
    const total = plans.length;
    const approved = plans.filter(p => p.status === "Approved").length;
    const pending = plans.filter(p => p.status === "Pending").length;
    const revision = plans.filter(p => p.status === "Needs Revision").length;

    const coverageIndex = total > 0 ? Math.round((approved / total) * 100) : 100;

    return { total, approved, pending, revision, coverageIndex };
  }, [plans]);

  // Filters lesson plan list based on search and parameters
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            plan.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClassId === "All" || plan.classId === selectedClassId;
      const matchesStatus = filterStatus === "All" || plan.status === filterStatus;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [plans, searchTerm, selectedClassId, filterStatus]);

  // Push administrative milestone directive (Syllabus Directive)
  const handleCreateMilestone = (e) => {
    e.preventDefault();

    if (!newMilestone.title || !newMilestone.objectives) {
      triggerNotification("Please specify both Title and Objectives for the curriculum milestone.", "error");
      return;
    }

    const uniqueId = "LPN-M" + Math.floor(100 + Math.random() * 900);
    const parsedObjectives = newMilestone.objectives.split('\n').filter(o => o.trim() !== "");

    const generatedRecord = {
      id: uniqueId,
      title: `[Milestone] ${newMilestone.title}`,
      classId: newMilestone.classId,
      subject: newMilestone.subject,
      teacherId: newMilestone.teacherId,
      weekNumber: Number(newMilestone.weekNumber),
      objectives: parsedObjectives.length > 0 ? parsedObjectives : ["Achieve mandatory curriculum standards."],
      duration: "Variable",
      materialsNeeded: "Mandated text references, syllabus guideline binders.",
      phases: [
        { step: "Phase 1 (Introduction)", activity: "Explain mandatory term milestones and review prerequisite schemas." },
        { step: "Phase 2 (Content Review)", activity: "Cover core competencies aligned with standard syllabus criteria." }
      ],
      assessmentMethod: "Quarterly standardized benchmark audit.",
      status: "Pending",
      remarks: ""
    };

    setPlans(prev => [generatedRecord, ...prev]);
    setIsMilestoneOpen(false);
    triggerNotification("Mandatory milestone distributed to faculty planner!", "success");

    setDbLogs(prev => [
      {
        id: "ADD-" + Math.floor(1000 + Math.random() * 9000),
        action: "MILESTONE_DIRECTIVE_BROADCASTED",
        details: `Pushed mandatory standard "${newMilestone.title}" to Week ${newMilestone.weekNumber}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    // Reset Milestone Form
    setNewMilestone({
      title: '',
      classId: CLASSES[0].id,
      subject: SUBJECTS[0],
      teacherId: TEACHERS[0].id,
      weekNumber: 1,
      objectives: ''
    });
  };

  // Audit: Approve Lesson Plan
  const handleApprovePlan = (targetId) => {
    setPlans(prev => prev.map(p => {
      if (p.id === targetId) {
        return { ...p, status: "Approved", remarks: adminRemark || p.remarks };
      }
      return p;
    }));

    triggerNotification("Lesson plan successfully authorized for term schedule.", "success");
    setDbLogs(prev => [
      {
        id: "MUT-" + Math.floor(1000 + Math.random() * 9000),
        action: "LESSON_PLAN_AUTHORIZED",
        details: `Lesson Plan ${targetId} approved with comments.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
    setAdminRemark("");
  };

  // Audit: Request Revision
  const handleRequestRevision = (targetId) => {
    if (!adminRemark) {
      triggerNotification("Please provide core revision comments before requesting changes.", "error");
      return;
    }

    setPlans(prev => prev.map(p => {
      if (p.id === targetId) {
        return { ...p, status: "Needs Revision", remarks: adminRemark };
      }
      return p;
    }));

    triggerNotification("Revision directive transmitted to assigned teacher.", "info");
    setDbLogs(prev => [
      {
        id: "MUT-" + Math.floor(1000 + Math.random() * 9000),
        action: "REVISION_REQUESTED",
        details: `Requested revision for Lesson Plan ${targetId} on terms: "${adminRemark}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
    setAdminRemark("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
        }`}>
          <span className="text-lg">{notification.type === 'error' ? '⚠️' : '⚙️'}</span>
          <p className="text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* ================= ADMIN PAGE HEADER ================= */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Syllabus & Lesson Plan Tracker</h1>
            <p className="text-sm text-slate-500 mt-1">
              Admin & Principal view to analyze syllabus timelines, audit lesson strategies, and enforce national educational standard milestones.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 rounded-lg text-sm shadow-sm transition flex items-center gap-2"
            >
              Export Syllabus Register (PDF)
            </button>
            <button
              onClick={() => setIsMilestoneOpen(true)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 font-bold text-white rounded-lg text-sm shadow-md transition flex items-center gap-2"
            >
              + Issue Syllabus Directive
            </button>
          </div>
        </div>
      </header>

      {/* ================= PRINT BANNER ================= */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 mt-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">Excel Academy International</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Official Syllabus & Lesson Plan Register Dossier</p>
        <div className="flex justify-between mt-6 text-xs text-slate-600 font-bold">
          <span>Active Filter: {selectedClassId === "All" ? "All School Cohorts" : CLASSES.find(c => c.id === selectedClassId)?.name}</span>
          <span>Syllabus Coverage Audit: {metrics.coverageIndex}% approved</span>
          <span>Report Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* ================= METRICS STATS BAR ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6 print:hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted Planners</span>
              <span className="text-2xl font-black text-slate-900">{metrics.total} <span className="text-xs font-semibold text-slate-400">Lessons</span></span>
            </div>
            <span className="text-2xl">📚</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Coverage</span>
              <span className="text-2xl font-black text-emerald-600">{metrics.coverageIndex}%</span>
            </div>
            <span className="text-2xl">✅</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Pending Audit</span>
              <span className="text-2xl font-black text-amber-500">{metrics.pending} <span className="text-xs font-semibold text-slate-400">Active</span></span>
            </div>
            <span className="text-2xl">⏳</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Revision Directives</span>
              <span className={`text-2xl font-black ${metrics.revision > 0 ? "text-rose-600 animate-pulse" : "text-slate-500"}`}>
                {metrics.revision} <span className="text-xs font-semibold text-slate-400">Changes</span>
              </span>
            </div>
            <span className="text-2xl">📝</span>
          </div>
        </div>
      </section>

      {/* ================= MAIN DASHBOARD BOARD ================= */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Submission Registry Table */}
        <section className="lg:col-span-6 space-y-6 print:hidden">
          
          {/* Filtering controllers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center print:hidden">
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Cohorts:</span>
              <div className="flex gap-1 overflow-x-auto">
                <button
                  onClick={() => setSelectedClassId("All")}
                  className={`px-2.5 py-1.5 text-xs font-extrabold rounded-lg transition-all ${
                    selectedClassId === "All" 
                      ? 'bg-slate-900 text-white shadow' 
                      : 'bg-slate-50 text-slate-600 border border-slate-150 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                {CLASSES.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-2.5 py-1.5 text-xs font-extrabold rounded-lg transition-all whitespace-nowrap ${
                      selectedClassId === cls.id 
                        ? 'bg-slate-900 text-white shadow' 
                        : 'bg-slate-50 text-slate-600 border border-slate-150 hover:bg-slate-100'
                    }`}
                  >
                    {cls.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending Audit</option>
                <option value="Approved">Approved</option>
                <option value="Needs Revision">Needs Revision</option>
              </select>
            </div>

          </div>

          {/* Lesson Plan Cards/List Layout */}
          <div className="space-y-4">
            {filteredPlans.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center text-slate-400 italic">
                No lesson planners submitted under selected query guidelines.
              </div>
            ) : (
              filteredPlans.map(plan => {
                const isSelected = plan.id === selectedPlanId;
                const teacherObj = TEACHERS.find(t => t.id === plan.teacherId);
                const classObj = CLASSES.find(c => c.id === plan.classId);

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-5 bg-white rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                      isSelected 
                        ? 'ring-2 ring-indigo-600 border-indigo-200 shadow-md transform scale-[1.01]' 
                        : 'border-slate-200 hover:border-slate-350 shadow-sm'
                    }`}
                  >
                    {/* Status Badge */}
                    <span className={`absolute top-4 right-4 text-[9px] px-2 py-0.5 rounded font-black uppercase border tracking-wider ${
                      plan.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      plan.status === "Needs Revision" ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {plan.status}
                    </span>

                    <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block mb-1">
                      {plan.subject} • Week {plan.weekNumber}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base leading-tight pr-24">{plan.title}</h4>
                    
                    <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-4 text-xs font-semibold text-slate-400">
                      <span>Facilitator: <span className="text-slate-800">{teacherObj?.name || "Teacher"}</span></span>
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500 uppercase">{classObj?.name}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </section>

        {/* RIGHT COLUMN: Live Interactive Document Sheet & Admin Controls */}
        <section className="lg:col-span-6 space-y-6 print:w-full print:p-0">
          
          {activePlan ? (
            <div className="space-y-6 print:w-full">
              
              {/* Admin Audit Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm print:hidden">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block mb-2">Principal Audit Deck</span>
                
                <textarea
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  placeholder="Insert review remarks or specified revision changes required..."
                  rows="3"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 resize-none font-semibold text-slate-700"
                ></textarea>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button
                    onClick={() => handleRequestRevision(activePlan.id)}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-lg transition"
                  >
                    Request Revision Changes
                  </button>
                  <button
                    onClick={() => handleApprovePlan(activePlan.id)}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition shadow-md"
                  >
                    Authorize Lesson Plan
                  </button>
                </div>
              </div>

              {/* Printable Document A4 Frame */}
              <div className="bg-white border-[6px] border-double border-slate-800 p-8 shadow-xl rounded-sm aspect-[1/1.41] relative flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:m-0 print:w-full">
                
                <div>
                  {/* Top Branding Header */}
                  <div className="text-center border-b border-slate-800 pb-3 mb-5">
                    <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Excel Academy International</h2>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Faculty Curriculum Blueprint & Syllabus Plan</p>
                    <span className="inline-block mt-3 bg-slate-900 text-white px-3 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded">
                      Approved Syllabus Schema
                    </span>
                  </div>

                  {/* Syllabus Metadata */}
                  <div className="grid grid-cols-2 gap-4 border-b border-dashed border-slate-200 pb-3 mb-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <p><span className="text-slate-400">Course Subject:</span> <span className="text-slate-900 font-extrabold">{activePlan.subject}</span></p>
                      <p><span className="text-slate-400">Class Target:</span> <span className="text-slate-800">{CLASSES.find(c => c.id === activePlan.classId)?.name}</span></p>
                      <p><span className="text-slate-400">Lesson Duration:</span> <span className="text-slate-800">{activePlan.duration}</span></p>
                    </div>
                    <div className="text-right space-y-1">
                      <p><span className="text-slate-400">Assigned Instructor:</span> <span className="text-slate-900 font-extrabold">{TEACHERS.find(t => t.id === activePlan.teacherId)?.name}</span></p>
                      <p><span className="text-slate-400">Curriculum Week:</span> <span className="text-slate-800">Week {activePlan.weekNumber}</span></p>
                      <p><span className="text-slate-400">Lesson ID:</span> <span className="text-slate-800 font-mono text-[10px]">{activePlan.id}</span></p>
                    </div>
                  </div>

                  {/* Objectives */}
                  <div className="mb-4 text-xs">
                    <h4 className="font-extrabold uppercase text-slate-900 tracking-wider mb-1.5 text-[10px]">I. Behavioral & Standard Objectives</h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 leading-relaxed font-medium">
                      {activePlan.objectives.map((obj, index) => (
                        <li key={index}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Materials */}
                  <div className="mb-4 text-xs">
                    <h4 className="font-extrabold uppercase text-slate-900 tracking-wider mb-1 text-[10px]">II. Materials & Tech Resources Required</h4>
                    <p className="text-slate-600 font-medium leading-relaxed italic">
                      "{activePlan.materialsNeeded}"
                    </p>
                  </div>

                  {/* Instruction Phases Table */}
                  <div className="mb-4 text-xs">
                    <h4 className="font-extrabold uppercase text-slate-900 tracking-wider mb-1.5 text-[10px]">III. Sequence of Instruction Phases</h4>
                    <table className="w-full border border-slate-100 text-left text-[11px] leading-relaxed">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="p-2 w-1/3">Lesson Phase & Time</th>
                          <th className="p-2">Target Activity / Methods</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activePlan.phases.map((ph, idx) => (
                          <tr key={idx} className="border-b border-slate-100 font-medium text-slate-600">
                            <td className="p-2 font-bold text-slate-800 bg-slate-50/50">{ph.step}</td>
                            <td className="p-2">{ph.activity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Assessment */}
                  <div className="mb-4 text-xs">
                    <h4 className="font-extrabold uppercase text-slate-900 tracking-wider mb-1 text-[10px]">IV. Assessment of Objective Mastery</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {activePlan.assessmentMethod}
                    </p>
                  </div>

                </div>

                {/* Footer Sign-off and Status remarks */}
                <div className="border-t border-slate-150 pt-3 text-[10px] text-slate-500 font-semibold space-y-2">
                  {activePlan.remarks && (
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
                      <span className="block text-[8px] font-black uppercase text-indigo-700 tracking-wider mb-0.5">Audit Desk comments</span>
                      <p className="italic text-slate-600 leading-tight">"{activePlan.remarks}"</p>
                    </div>
                  )}

                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <span className="block text-slate-400 text-[8px] uppercase font-bold">Document Database Hash</span>
                      <span className="font-mono text-slate-900 font-bold">{activePlan.id}-SECURE-VERIFIED</span>
                    </div>
                    <div className="text-center">
                      <div className="w-24 border-t border-slate-400 mx-auto mb-1"></div>
                      <span>Principal Sign-off Seal</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center italic text-slate-400 print:hidden">
              Select any lesson planner to perform administrative curriculum audits.
            </div>
          )}

          {/* SIMULATED SYSTEM TRANSACTION LOGS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm print:hidden">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Syllabus Sync Logs</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {dbLogs.map((log) => (
                <div key={log.id} className="text-xs bg-slate-50 p-2.5 border border-slate-150 rounded flex justify-between items-center font-mono">
                  <div>
                    <span className="font-bold text-indigo-600 block text-[9px]">{log.id} — {log.action}</span>
                    <span className="text-slate-500 text-[9px] font-sans block mt-0.5">{log.details}</span>
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold whitespace-nowrap">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>

      {/* ================= STANDARD SYLLABUS DIRECTIVE CREATOR MODAL ================= */}
      {isMilestoneOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-black text-slate-900">Issue Mandatory Syllabus Directive</h3>
              <button 
                onClick={() => setIsMilestoneOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold transition p-1"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateMilestone} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Standard Milestone / Topic Title *</label>
                <input 
                  type="text" required value={newMilestone.title} 
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. Limits in High Dimensions / Organic Compound Synthesis"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Assigned Teacher</label>
                  <select 
                    value={newMilestone.teacherId} 
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, teacherId: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                  >
                    {TEACHERS.map(tch => (
                      <option key={tch.id} value={tch.id}>{tch.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Subject Track</label>
                  <select 
                    value={newMilestone.subject} 
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                  >
                    {SUBJECTS.map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Syllabus Cohort</label>
                  <select 
                    value={newMilestone.classId} 
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, classId: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                  >
                    {CLASSES.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Target Curriculum Week</label>
                  <input 
                    type="number" min="1" max="20" required value={newMilestone.weekNumber}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, weekNumber: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Mandatory Objectives (One per line) *</label>
                <textarea 
                  required value={newMilestone.objectives} 
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, objectives: e.target.value }))}
                  placeholder="e.g. Draw free-body vector models.&#10;Identify critical mass values."
                  rows="3"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3 font-semibold rounded-lg transition text-sm shadow mt-2"
              >
                Broadcast Curriculum Directive
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}