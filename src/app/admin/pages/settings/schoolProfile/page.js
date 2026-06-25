"use client";

import React, { useState } from "react";
import { 
  Building2, MapPin, Globe, Award, Palette, Share2, 
  FileCheck, MessageSquare, Cpu, Save, Edit3, ShieldCheck, Camera
} from "lucide-react";

export default function SchoolProfileWorkspace() {
  // Master Interactive State Matrix mapped directly to relational database keys
  const [profile, setProfile] = useState({
    // Basic Information
    schoolLogo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=150&auto=format&fit=crop",
    schoolName: "Greenwood International Senior Secondary School",
    schoolCode: "GWIS-ND-9921",
    udiseCode: "09241203804",
    affiliationNumber: "CBSE/AFF/2130894",
    schoolType: "Co-Educational Upper Secondary",
    establishmentYear: "2012",

    // Contact Information
    schoolEmail: "info@greenwood.edu.in",
    schoolPhone: "+91 120 4982300",
    alternatePhone: "+91 98765 11223",
    website: "https://www.greenwood.edu.in",

    // Address
    address: "Plot 4B, Knowledge Park Institutional Area, Phase-III",
    city: "Greater Noida",
    district: "Gautam Buddha Nagar",
    state: "Uttar Pradesh",
    pincode: "201310",

    // Academic Information
    board: "CBSE (Central Board of Secondary Education)",
    currentSession: "2026-2027",
    mediumOfInstruction: "English Medium",
    classesOffered: "Nursery to Grade XII (Science, Commerce, Humanities)",
    workingDays: "220 Days Per Annum",

    // Branding & Validation Assets
    favicon: "⭐",
    reportCardLogo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=50",
    signature: "Sarah Jenkins [Principal]",
    schoolStamp: "[Certified Greenwood Seal v4.26]",
    certificateLogo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=50",

    // Social Media Handles
    facebook: "https://facebook.com/greenwood_international",
    instagram: "https://instagram.com/greenwood_academy",
    youtube: "https://youtube.com/c/greenwood_edu_channel",
    linkedin: "https://linkedin.com/school/greenwood-institutional-trust",

    // Description & Public Content
    aboutSchool: "Greenwood International is a premier K-12 residential-cum-day school dedicated to foster exceptional academic brilliance, character build, and digital-first innovation frameworks.",
    vision: "To empower global learners with rigorous logical baselines, emotional resilience, and deep societal empathy standards.",
    mission: "Deploy cutting-edge interactive technological sandboxes, optimized student-teacher ratios, and high-fidelity global compliance systems.",
    principalMessage: "Welcome to our digital workspace. Our educational framework is mapped directly to future-proof career models while retaining native cultural integrity vectors.",

    // ================= ENHANCED SAAS EXTRA CORE CONFIGURATIONS =================
    smsGatewayUrl: "https://api.smsrouter.internal/v2/send?key=gw_secure_8921",
    paymentGatewayKey: "rzp_live_M921Kls9380Aks",
    gpsTrackingToken: "fleet_gps_token_9942_active",
    biometricSyncVendor: "Matrix Cossec Integration Terminal v4"
  });

  // UI Flow Control states
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Modular change handler for form elements
  const handleFieldChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    console.log("Committed complete school configuration profile payload to database infrastructure:", profile);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Realtime Success Validation Toast */}
        {showToast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <span className="bg-indigo-600 p-1 rounded-full text-xs text-white">✓</span>
            <p className="text-xs font-bold">School profile configuration committed securely to system core tables!</p>
          </div>
        )}

        {/* ================= HEADER BRANDING BAR ================= */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              
              {/* Dynamic Interactive Identity Logo */}
              <div className="relative group">
                <img 
                  src={profile.schoolLogo} 
                  alt="School Emblem" 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 p-1 bg-white shadow-lg"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-lg cursor-pointer hover:bg-indigo-700 transition">
                    <Camera size={12} className="text-white" />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        if(e.target.files?.[0]) handleFieldChange("schoolLogo", URL.createObjectURL(e.target.files[0]));
                      }} 
                    />
                  </label>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{profile.schoolName}</h1>
                <p className="text-xs text-slate-400 font-mono font-semibold tracking-wide">
                  SYSTEM CODE: <span className="text-indigo-400">{profile.schoolCode}</span> • UDISE MATRIX: <span className="text-indigo-400">{profile.udiseCode}</span>
                </p>
                <div className="text-xs text-slate-400 font-medium flex flex-wrap gap-x-4 gap-y-1 justify-center sm:justify-start">
                  <span>📍 {profile.city}, {profile.state}</span>
                  <span>🌐 {profile.website}</span>
                </div>
              </div>
            </div>

            {/* Global Context Control Button */}
            <div className="w-full md:w-auto">
              {isEditing ? (
                <button 
                  onClick={handleFormSubmit}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Save size={14} /> Commit Settings
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Edit3 size={14} className="text-indigo-400" /> Modify Identity Metrics
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= MULTI-TAB CONTROLLER MATRIX ================= */}
        <div className="flex border-b border-slate-200 bg-white px-6 rounded-2xl shadow-2xs gap-1 overflow-x-auto text-xs font-bold uppercase tracking-wider text-slate-500 scrollbar-none">
          {[
            { id: "basic", label: "🏢 Basic & Contact Info", icon: Building2 },
            { id: "academic", label: "📚 Academic Setup", icon: Award },
            { id: "branding", label: "🎨 Brand & Verification Assets", icon: Palette },
            { id: "social", label: "🌐 Digital & Social Hub", icon: Share2 },
            { id: "documents", label: "📄 Compliance Documents", icon: FileCheck },
            { id: "content", label: "📝 Public Profiles & Copy", icon: MessageSquare },
            { id: "saas", label: "🧬 SaaS Core Gateways", icon: Cpu }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap font-bold text-[11px] transition-all ${
                activeTab === tab.id 
                  ? "border-indigo-600 text-indigo-700 bg-slate-50/50" 
                  : "border-transparent hover:text-slate-800 hover:bg-slate-50/20"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= COMPONENT CONTAINER GRID BODY ================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs min-h-[400px]">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            
            {/* TAB 1: Basic & Contact Information */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Section A: Institutional Identifiers */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1.5">A. Institutional Primary Identifiers</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                      { id: "schoolName", label: "School Legal Registration Name", type: "text", editable: false },
                      { id: "schoolCode", label: "Internal School Code Key", type: "text", editable: false },
                      { id: "udiseCode", label: "National UDISE Code Parameter", type: "text", editable: false },
                      { id: "affiliationNumber", label: "Board Affiliation Ledger Number", type: "text", editable: false },
                      { id: "schoolType", label: "Institutional Category Classification", type: "text", editable: false },
                      { id: "establishmentYear", label: "Establishment Year Foundation", type: "text", editable: false }
                    ].map(field => (
                      <div key={field.id} className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{field.label}</span>
                        <p className="text-sm font-bold text-slate-900 font-mono">{profile[field.id]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Communications Gateways */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest border-b pb-1.5">B. Communication Channels & Address Mapping</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                      { id: "schoolEmail", label: "Official Helpdesk Email ID", type: "email" },
                      { id: "schoolPhone", label: "Primary Telecom Hotline", type: "text" },
                      { id: "alternatePhone", label: "Alternate Back-up Mobile", type: "text" },
                      { id: "website", label: "Public Web Domain Anchor", type: "url" }
                    ].map(field => (
                      <div key={field.id} className={`p-3.5 rounded-xl border transition-all ${isEditing ? 'border-indigo-200 bg-white shadow-2xs' : 'bg-slate-50 border-slate-100'}`}>
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{field.label}</span>
                        {isEditing ? (
                          <input 
                            type={field.type} 
                            value={profile[field.id]} 
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none border-b border-indigo-200 pb-0.5 font-mono"
                          />
                        ) : (
                          <p className="text-sm font-bold text-slate-800 font-mono">{profile[field.id]}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Complete Postal Address Layout Row */}
                  <div className={`p-4 rounded-xl border mt-4 ${isEditing ? 'border-indigo-200 bg-white' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Official Physical Location / Postal Coordinates</span>
                    {isEditing ? (
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        <input type="text" value={profile.address} placeholder="Street Address" onChange={(e)=>handleFieldChange("address",e.target.value)} className="sm:col-span-2 text-xs font-bold p-2 border rounded bg-slate-50 outline-none" />
                        <input type="text" value={profile.city} placeholder="City" onChange={(e)=>handleFieldChange("city",e.target.value)} className="text-xs font-bold p-2 border rounded bg-slate-50 outline-none" />
                        <input type="text" value={profile.district} placeholder="District" onChange={(e)=>handleFieldChange("district",e.target.value)} className="text-xs font-bold p-2 border rounded bg-slate-50 outline-none" />
                        <input type="text" value={profile.state} placeholder="State" onChange={(e)=>handleFieldChange("state",e.target.value)} className="text-xs font-bold p-2 border rounded bg-slate-50 outline-none" />
                        <input type="text" value={profile.pincode} placeholder="Pincode" onChange={(e)=>handleFieldChange("pincode",e.target.value)} className="text-xs font-bold p-2 border rounded bg-slate-50 outline-none font-mono" />
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin size={14} className="text-slate-400" />
                        {profile.address}, {profile.city}, {profile.district}, {profile.state} - <span className="font-mono">{profile.pincode}</span>
                      </p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: Academic Setup */}
            {activeTab === "academic" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1.5">Academic Operations Parameters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { id: "board", label: "Affiliation Board Framework Authority" },
                    { id: "currentSession", label: "Active Calendar Academic Session Year" },
                    { id: "mediumOfInstruction", label: "Primary Medium of Instruction Language" },
                    { id: "classesOffered", label: "Permitted Classes/Streams Offered Grid" },
                    { id: "workingDays", label: "Mandated Annual Operational Working Days" }
                  ].map(field => (
                    <div key={field.id} className={`p-4 rounded-xl border transition-all ${isEditing ? 'border-indigo-200 bg-white' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{field.label}</span>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={profile[field.id]} 
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none border-b border-indigo-200 pb-0.5"
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-900">{profile[field.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Branding & Verification Assets */}
            {activeTab === "branding" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1.5">Document Branding Header Graphics Assets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { id: "reportCardLogo", label: "Report Card Header Identity Logo" },
                    { id: "certificateLogo", label: "Official Certificate Identity Logo" },
                    { id: "signature", label: "Principal Cryptographic Specimen Signature", isText: true },
                    { id: "schoolStamp", label: "Authorized Institutional Digital Stamp Mark", isText: true },
                    { id: "favicon", label: "Web Portal Shell System Favicon Asset", isText: true }
                  ].map(asset => (
                    <div key={asset.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-center flex flex-col justify-between items-center h-44">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider text-left w-full mb-2">{asset.label}</span>
                      
                      <div className="flex-1 flex items-center justify-center">
                        {asset.isText ? (
                          <span className="text-sm font-black font-mono text-slate-800 bg-white border px-3 py-1.5 rounded-lg shadow-inner">{profile[asset.id]}</span>
                        ) : (
                          <img src={profile[asset.id]} alt="Asset Preview" className="w-14 h-14 object-cover border p-1 rounded-xl bg-white shadow-xs" />
                        )}
                      </div>

                      {isEditing && (
                        <button 
                          type="button" 
                          onClick={() => alert(`Target dynamic asset allocation listener open for mapping: ${asset.id}`)}
                          className="w-full mt-2 py-1.5 text-[10px] bg-white border hover:bg-indigo-600 hover:text-white transition rounded-lg font-bold uppercase tracking-wide"
                        >
                          Replace Source Asset
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Digital & Social Media Hub */}
            {activeTab === "social" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1.5">Public Outreach Social Endpoints</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { id: "facebook", label: "Official Facebook Institutional Link Copy" },
                    { id: "instagram", label: "Official Instagram Hub Identity Link" },
                    { id: "youtube", label: "Broadcast YouTube Video Feed Channel Link" },
                    { id: "linkedin", label: "Corporate LinkedIn Organizational Handle" }
                  ].map(network => (
                    <div key={network.id} className={`p-4 rounded-xl border transition-all ${isEditing ? 'border-indigo-200 bg-white' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{network.label}</span>
                      {isEditing ? (
                        <input 
                          type="url" 
                          value={profile[network.id]} 
                          onChange={(e) => handleFieldChange(network.id, e.target.value)}
                          className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none border-b border-indigo-200 pb-0.5 font-mono"
                        />
                      ) : (
                        <p className="text-sm font-bold text-indigo-600 hover:underline truncate font-mono">{profile[network.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Compliance Documents Ledger */}
            {activeTab === "documents" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1.5">Compliance Binders & Regulatory Proofs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { title: "National UDISE System Certificate Copy", code: "UDISE-CERT" },
                    { title: "Board Affiliation Sanction Order Letter", code: "AFF-SANCTION" },
                    { title: "State Department Recognition Proof", code: "GOVT-RECOG" },
                    { title: "Institutional NOC Compliance Documentation", code: "NOC-BINDER" }
                  ].map((doc, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-2xl p-5 text-center bg-slate-50 hover:bg-white transition flex flex-col justify-between h-40 shadow-2xs">
                      <span className="text-xl">📄</span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 leading-tight">{doc.title}</h4>
                        <span className="text-[8px] font-mono font-bold text-slate-400 uppercase block mt-1 tracking-widest">{doc.code}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => alert(`Opening secure infrastructure crypt reader asset copy window for authorization code: ${doc.code}`)}
                        className="w-full py-1.5 bg-white text-[10px] border font-bold rounded-lg hover:bg-slate-900 hover:text-white transition uppercase"
                      >
                        Inspect Verify Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: Public Profiles Text Copy */}
            {activeTab === "content" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1.5">Public Copy Descriptions & Core Content blocks</h3>
                <div className="grid grid-cols-1 gap-5">
                  {[
                    { id: "aboutSchool", label: "About School Institutional Profile Copy" },
                    { id: "vision", label: "Official Long-term Academic Vision Statement" },
                    { id: "mission", label: "Core Institutional Execution Mission Directive" },
                    { id: "principalMessage", label: "Active Principal Desk Message Text Copy Block" }
                  ].map(block => (
                    <div key={block.id} className={`p-4 rounded-xl border transition-all ${isEditing ? 'border-indigo-200 bg-white' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">{block.label}</span>
                      {isEditing ? (
                        <textarea 
                          value={profile[block.id]} 
                          rows={3} 
                          onChange={(e) => handleFieldChange(block.id, e.target.value)}
                          className="w-full text-xs font-semibold text-slate-800 bg-slate-50/50 p-2.5 rounded-lg border outline-none focus:bg-white resize-none leading-relaxed"
                        />
                      ) : (
                        <p className="text-xs font-medium text-slate-600 leading-relaxed text-justify">{profile[block.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= BONUS ADDITION TAB 7: ENHANCED SAAS INFRASTRUCTURE SYSTEM GATEWAYS ================= */}
            {activeTab === "saas" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b pb-1.5">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">SaaS Communication & Fiscal Transaction Gateways</h3>
                  <span className="text-[9px] font-mono font-bold uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-indigo-700">System Integrated APIs</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { id: "smsGatewayUrl", label: "Global SMS Transactional Alert API Route Gateway Handler" },
                    { id: "paymentGatewayKey", label: "Payment Gateway Master merchant Key Handle (MID Key)" },
                    { id: "gpsTrackingToken", label: "Fleet Logistics Tracking Dispatch Telematics Core Token" },
                    { id: "biometricSyncVendor", label: "Biometric Hardware Scanner Server Listener Sync Stack Vendor" }
                  ].map(gateway => (
                    <div key={gateway.id} className={`p-4 rounded-xl border transition-all ${isEditing ? 'border-indigo-200 bg-white' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{gateway.label}</span>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={profile[gateway.id]} 
                          onChange={(e) => handleFieldChange(gateway.id, e.target.value)}
                          className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none border-b border-indigo-200 pb-0.5 font-mono text-indigo-700"
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-700 font-mono tracking-tight bg-white p-2 rounded border border-slate-100 shadow-inner">{profile[gateway.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </form>
        </div>

        {/* ================= OVERRIDE INFRASTRUCTURE BASE RIBBON ================= */}
        <div className="bg-slate-900 text-slate-400 p-4 rounded-xl text-xs font-bold font-mono tracking-wider flex flex-col sm:flex-row justify-between items-center gap-3 shadow-md border border-slate-800">
          <span className="flex items-center gap-2 text-slate-300">
            <ShieldCheck size={14} className="text-indigo-400" />
            SaaS SYSTEM ISOLATION DOMAIN LAYER: MAPPED TO ORGANIZATIONAL TRUST MASTER BINDINGS
          </span>
          <span className="text-[10px] text-slate-500">RELATIONAL LOGS OK</span>
        </div>

      </div>
    </div>
  );
}