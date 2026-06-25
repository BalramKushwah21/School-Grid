"use client";

import React, { useState } from "react";
import { 
  User, Shield, Briefcase, Lock, FileText, Camera, Phone, 
  MapPin, Award, CheckCircle, Edit3, Key, Eye, EyeOff, Save
} from "lucide-react";

export default function AdminProfile() {
  // Master Admin State - Directly mapped to enterprise schema
  const [profile, setProfile] = useState({
    // Overview & Read-only Meta
    profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    firstName: "Sarah",
    lastName: "Jenkins",
    employeeId: "ADM-2026-8942",
    designation: "Principal & Chief Administrator",
    department: "Institutional Operations & Governance",
    email: "principal.sarah@greenwood.edu.in",
    status: "Active",
    
    // Personal Information (Mix of read-only and editable)
    gender: "Female",
    dob: "1984-05-14",
    bloodGroup: "O+",
    maritalStatus: "Married",
    mobileNumber: "+91 98765 43210",
    alternateMobile: "+91 98765 43211",
    address: "H-12, Administrative Bungalow, Greenwood Campus",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",

    // Professional Information
    role: "Super Administrator",
    qualification: "Ph.D. in Educational Leadership & Administration",
    experience: "16 Years of Institutional Directorship",
    specialization: "K-12 Policy Compliance & Strategic Fiscal Growth",

    // Account & Security
    username: "sarah.admin2026",
    password: "••••••••••••••••"
  });

  // UI Control states
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Separate states for password updates
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [showPassFlags, setShowPassFlags] = useState({ current: false, next: false, confirm: false });

  // Handle updates for explicitly editable fields only
  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Simulate Cloud Commit Save Event
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    console.log("Committed authorized profile alterations to database:", profile);
  };

  // Simulate Password Swap Commit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      alert("Validation Error: New passwords do not match.");
      return;
    }
    setProfile(prev => ({ ...prev, password: passwords.next }));
    setShowPasswordModal(false);
    setPasswords({ current: "", next: "", confirm: "" });
    alert("Security Matrix Updated: Password changed successfully.");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800 antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Real-time DB Sync Toast Notification */}
        {showToast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <span className="bg-indigo-600 p-1 rounded-full text-xs text-white">✓</span>
            <p className="text-xs font-bold">Profile updates safely committed to your SQL database!</p>
          </div>
        )}

        {/* ================= SECTION I: OVERVIEW PANEL HEADER ================= */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-600/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              
              {/* Profile Photo Wrapper (Editable Feature) */}
              <div className="relative group">
                <img 
                  src={profile.profilePhoto} 
                  alt="Admin Profile" 
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-800 shadow-xl group-hover:border-indigo-500 transition-all duration-300"
                />
                <label className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded-lg cursor-pointer shadow-md transition-transform hover:scale-105">
                  <Camera size={14} className="text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if(e.target.files?.[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        handleInputChange("profilePhoto", url);
                      }
                    }} 
                  />
                </label>
              </div>

              {/* Identity Headers */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">{profile.firstName} {profile.lastName}</h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                    {profile.status}
                  </span>
                </div>
                <p className="text-slate-400 font-mono text-xs">{profile.employeeId} • {profile.department}</p>
                <p className="text-indigo-400 text-sm font-semibold">{profile.designation}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-medium justify-center sm:justify-start pt-1">
                  <span>✉️ {profile.email}</span>
                  <span>📞 {profile.mobileNumber}</span>
                </div>
              </div>
            </div>

            {/* Editing Action Triggers */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              {isEditing ? (
                <button 
                  onClick={handleSaveProfile}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Save size={14} /> Commit Changes
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Edit3 size={14} className="text-indigo-400" /> Modify Field Metrics
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= TAB CONTROLLER NAVIGATION ================= */}
        <div className="flex border-b border-slate-200 bg-white px-6 rounded-2xl shadow-2xs gap-2 overflow-x-auto text-xs font-bold uppercase tracking-wider text-slate-500 scrollbar-none">
          {[
            { id: "personal", label: "👤 Personal Binders", icon: User },
            { id: "professional", label: "💼 Professional Specs", icon: Briefcase },
            { id: "security", label: "🔒 Account & Security", icon: Lock },
            { id: "documents", label: "📄 Documents Ledger", icon: FileText },
          ].map((tab) => (
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

        {/* ================= MAIN PROFILE CONTENT CONTROLLER ================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs min-h-[350px]">
          
          {/* TAB 1: Personal Information Matrix */}
          {activeTab === "personal" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b pb-2">Personal Information Registry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Fixed Non-Editable Core Data Cells */}
                {[
                  { label: "First Name", value: profile.firstName },
                  { label: "Last Name", value: profile.lastName },
                  { label: "Gender Parameter", value: profile.gender },
                  { label: "Date of Birth (DOB)", value: profile.dob },
                  { label: "Blood Group Profile", value: profile.bloodGroup },
                  { label: "Marital Status (Optional)", value: profile.maritalStatus },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/80">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</span>
                    <p className="text-sm font-bold text-slate-800 font-mono">{item.value}</p>
                  </div>
                ))}

                {/* Explicitly EDITABLE Contact Data Cell */}
                <div className={`p-3.5 rounded-xl border transition-all ${isEditing ? 'border-indigo-300 bg-white ring-2 ring-indigo-50' : 'bg-slate-50 border-slate-100/80'}`}>
                  <span className="block text-[10px] font-black text-indigo-500 uppercase tracking-wider mb-1">Mobile Number (Editable)</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.mobileNumber} 
                      onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                      className="w-full text-sm font-bold text-slate-800 font-mono bg-transparent outline-none border-b border-indigo-200 pb-0.5"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-800 font-mono">{profile.mobileNumber}</p>
                  )}
                </div>

                {/* Explicitly EDITABLE Alternate Contact Data Cell */}
                <div className={`p-3.5 rounded-xl border transition-all ${isEditing ? 'border-indigo-300 bg-white ring-2 ring-indigo-50' : 'bg-slate-50 border-slate-100/80'}`}>
                  <span className="block text-[10px] font-black text-indigo-500 uppercase tracking-wider mb-1">Alternate Mobile (Editable)</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.alternateMobile} 
                      onChange={(e) => handleInputChange("alternateMobile", e.target.value)}
                      className="w-full text-sm font-bold text-slate-800 font-mono bg-transparent outline-none border-b border-indigo-200 pb-0.5"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-800 font-mono">{profile.alternateMobile || "None Enlisted"}</p>
                  )}
                </div>

                {/* Explicitly EDITABLE Infrastructure Address Stack */}
                <div className={`p-3.5 rounded-xl border transition-all sm:col-span-2 lg:col-span-3 ${isEditing ? 'border-indigo-300 bg-white ring-2 ring-indigo-50' : 'bg-slate-50 border-slate-100/80'}`}>
                  <span className="block text-[10px] font-black text-indigo-500 uppercase tracking-wider mb-1">Permanent Residential Address (Editable)</span>
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-1">
                      <input 
                        type="text" 
                        value={profile.address} 
                        placeholder="Street House address"
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="sm:col-span-2 text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded border border-slate-200 outline-none focus:bg-white"
                      />
                      <input 
                        type="text" 
                        value={profile.city} 
                        placeholder="City"
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded border border-slate-200 outline-none focus:bg-white"
                      />
                      <input 
                        type="text" 
                        value={profile.state} 
                        placeholder="State"
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded border border-slate-200 outline-none focus:bg-white"
                      />
                      <input 
                        type="text" 
                        value={profile.pincode} 
                        placeholder="Pincode"
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        className="text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded border border-slate-200 outline-none focus:bg-white font-mono"
                      />
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      {profile.address}, {profile.city}, {profile.state} - <span className="font-mono">{profile.pincode}</span>
                    </p>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Professional Information Matrix */}
          {activeTab === "professional" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b pb-2">Professional Credentials Repository</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Immutable Systems Architecture Values */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Corporate Core Role</span>
                  <p className="text-sm font-bold text-slate-800">{profile.role}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Functional Designation Title</span>
                  <p className="text-sm font-bold text-slate-800">{profile.designation}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80 md:col-span-2">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Department Specialization Bounds</span>
                  <p className="text-sm font-bold text-slate-800">{profile.specialization}</p>
                </div>

                {/* EDITABLE Academic Qualification Dossier */}
                <div className={`p-4 rounded-xl border transition-all md:col-span-2 ${isEditing ? 'border-indigo-300 bg-white ring-2 ring-indigo-50' : 'bg-slate-50 border-slate-100/80'}`}>
                  <span className="block text-[10px] font-black text-indigo-500 uppercase tracking-wider mb-1">Academic Qualifications Profile (Editable)</span>
                  {isEditing ? (
                    <textarea 
                      value={profile.qualification} 
                      onChange={(e) => handleInputChange("qualification", e.target.value)}
                      rows={2}
                      className="w-full text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border outline-none focus:bg-white resize-none"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-800 flex items-start gap-2">
                      <Award size={16} className="text-indigo-500 mt-0.5 shrink-0" /> {profile.qualification}
                    </p>
                  )}
                </div>

                {/* EDITABLE Service Experience Duration Metric */}
                <div className={`p-4 rounded-xl border transition-all md:col-span-2 ${isEditing ? 'border-indigo-300 bg-white ring-2 ring-indigo-50' : 'bg-slate-50 border-slate-100/80'}`}>
                  <span className="block text-[10px] font-black text-indigo-500 uppercase tracking-wider mb-1">Professional Directorship Experience (Editable)</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.experience} 
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className="w-full text-sm font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border outline-none focus:bg-white"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-800">{profile.experience}</p>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: Account Security Interface */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b pb-2">Account Identity & System Encryption</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Immutable Identity handles */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Account Unique Username</span>
                  <p className="text-sm font-bold text-slate-700 font-mono">{profile.username}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Registered Encryption Email ID</span>
                  <p className="text-sm font-bold text-slate-700 font-mono">{profile.email}</p>
                </div>

                {/* Cryptographic Key Mutation Access Box */}
                <div className="p-4 rounded-xl border border-slate-200 md:col-span-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Access Authentication Key</span>
                    <p className="text-sm font-mono tracking-widest font-bold text-slate-800">{profile.password}</p>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition"
                  >
                    <Key size={13} className="text-indigo-400" /> Rotate Password Token
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: Documents Matrix Ledger */}
          {activeTab === "documents" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b pb-2">Institutional Compliance Document Records</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { title: "Profile Token Photo", type: "JPEG IMAGE COPY", icon: "🖼️" },
                  { title: "National Identification Proof", type: "AADHAR / PASSPORT BINARY", icon: "🪪" },
                  { title: "Qualification Certificates Binder", type: "COMBINED PDF LOGS", icon: "🎓" }
                ].map((doc, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl p-5 text-center bg-slate-50 hover:bg-white hover:border-indigo-200 transition group flex flex-col justify-between h-44">
                    <div className="text-2xl pt-2 group-hover:scale-110 transition-transform duration-300">{doc.icon}</div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-slate-900">{doc.title}</h4>
                      <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">{doc.type}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => alert(`Opening secure asset reader window for ${doc.title}...`)}
                      className="w-full py-1.5 bg-white border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition text-[10px] font-bold rounded-lg uppercase tracking-wider"
                    >
                      Inspect Secure File
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* System Operations Base Security Tag */}
        <div className="bg-slate-900 p-4 rounded-xl text-xs font-bold font-mono tracking-wider text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="flex items-center gap-2 text-slate-300">
            <Shield size={13} className="text-indigo-400" />
            ADMIN SECURITY PROTOCOL OVERRIDE ACTIVE • EXPLICIT GUARDRAILS LOADED
          </span>
          <span className="text-[10px] text-slate-500 font-mono">PORTAL MATRIX INT ACT</span>
        </div>

      </div>

      {/* ================= MODAL MATRIX: SECURE PASSWORD TOKENS CONFIGURATOR ================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider">Rotate Cryptographic Key</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs font-bold text-slate-500">
              {/* Field 1: Current Pass */}
              <div className="space-y-1 relative">
                <label className="uppercase tracking-wide text-[10px]">Current Secure Key</label>
                <input 
                  type={showPassFlags.current ? "text" : "password"} 
                  value={passwords.current}
                  onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                  required
                  className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-mono"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassFlags(f => ({ ...f, current: !f.current }))}
                  className="absolute bottom-2.5 right-3 text-slate-400 hover:text-indigo-600"
                >
                  {showPassFlags.current ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Field 2: New Pass */}
              <div className="space-y-1 relative">
                <label className="uppercase tracking-wide text-[10px]">New Proposed Secure Key</label>
                <input 
                  type={showPassFlags.next ? "text" : "password"} 
                  value={passwords.next}
                  onChange={(e) => setPasswords(p => ({ ...p, next: e.target.value }))}
                  required
                  className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-mono"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassFlags(f => ({ ...f, next: !f.next }))}
                  className="absolute bottom-2.5 right-3 text-slate-400 hover:text-indigo-600"
                >
                  {showPassFlags.next ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Field 3: Confirm Pass */}
              <div className="space-y-1 relative">
                <label className="uppercase tracking-wide text-[10px]">Confirm Proposed Secure Key</label>
                <input 
                  type={showPassFlags.confirm ? "text" : "password"} 
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  required
                  className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-mono"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassFlags(f => ({ ...f, confirm: !f.confirm }))}
                  className="absolute bottom-2.5 right-3 text-slate-400 hover:text-indigo-600"
                >
                  {showPassFlags.confirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-xs uppercase tracking-wider transition"
                >
                  Cancel Rotation
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs uppercase tracking-wider rounded-lg transition shadow-sm"
                >
                  Confirm Matrix Swap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}