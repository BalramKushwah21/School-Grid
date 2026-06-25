"use client";

import React, { useState } from "react";
import { 
  User, Mail, Phone, MapPin, Award, Lock, 
  Eye, EyeOff, Save, Edit2, ShieldCheck, Camera 
} from "lucide-react";

export default function TeacherProfile() {
  // Master Profile State - Ready to bind with your backend database tables
  const [profile, setProfile] = useState({
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    fullName: "Anjali Sharma",
    teacherId: "TCH-2026-042",
    designation: "Senior PGT Teacher",
    department: "Mathematics & Computing",
    email: "anjali.maths@greenwood.edu.in",
    
    // Editable Fields
    mobileNumber: "+91 94123 45678",
    alternateMobile: "+91 94123 45679",
    address: "Flat 302, Royal Palms Residency, Sector 62",
    city: "Noida",
    pincode: "201301",
    qualification: "M.Sc. in Mathematics, B.Ed. (First Class)",
    experience: "8 Years",
  });

  // Password mutation local states
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [showPass, setShowPass] = useState({ current: false, next: false, confirm: false });
  
  // Layout interaction states
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    console.log("Profile data saved to backend database model:", profile);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      alert("Error: New passwords do not match!");
      return;
    }
    alert("Security Key Changed Successfully!");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Dynamic Database Sync Success Toast */}
        {showToast && (
          <div className="fixed top-6 right-6 z-50 bg-teal-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-teal-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <span className="bg-teal-600 p-1 rounded-full text-xs text-white">✓</span>
            <p className="text-xs font-bold">Profile information updated in database logs!</p>
          </div>
        )}

        {/* ================= SECTION 1: TEACHER CARD HEADER ================= */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white p-6 rounded-2xl border border-teal-700 shadow-md flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            
            {/* Interactive Profile Picture Allocation */}
            <div className="relative">
              <img 
                src={profile.profilePhoto} 
                alt="Teacher Profile" 
                className="w-20 h-20 rounded-xl object-cover border-2 border-teal-400 p-0.5 bg-white shadow-md"
              />
              <label className="absolute -bottom-1 -right-1 bg-teal-600 hover:bg-teal-700 p-1.5 rounded-lg cursor-pointer shadow transition-transform hover:scale-105">
                <Camera size={12} className="text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleInputChange("profilePhoto", URL.createObjectURL(e.target.files[0]));
                  }} 
                />
              </label>
            </div>

            <div>
              <h2 className="text-xl font-black tracking-tight">{profile.fullName}</h2>
              <p className="text-teal-300 font-mono text-xs font-bold uppercase tracking-wide">{profile.teacherId} • {profile.department}</p>
              <p className="text-slate-300 text-xs mt-1 font-medium">{profile.designation}</p>
            </div>
          </div>

          <div className="bg-teal-900/50 border border-teal-700 p-2 rounded-xl text-center text-xs font-bold px-4 flex items-center gap-2 shrink-0">
            <ShieldCheck size={14} className="text-teal-400" /> Faculty Portal Secure
          </div>
        </div>

        {/* ================= SECTION 2: EDITABLE BASIC INFORMATION ================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b pb-2.5">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <User size={16} className="text-teal-600" /> General Profile Settings
            </h3>
            
            <button
              type="button"
              onClick={isEditing ? handleProfileSave : () => setIsEditing(true)}
              className={`text-xs font-bold px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all shadow-2xs ${
                isEditing 
                  ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" 
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              {isEditing ? <Save size={13} /> : <Edit2 size={13} className="text-teal-600" />}
              {isEditing ? "Save Settings" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-bold text-slate-500">
            
            {/* Read Only Institutional Data Blocks */}
            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <span className="block text-[10px] uppercase text-slate-400 tracking-wider mb-1">Official Email Address</span>
              <p className="text-sm font-semibold text-slate-700 font-mono flex items-center gap-1.5"><Mail size={12} /> {profile.email}</p>
            </div>

            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <span className="block text-[10px] uppercase text-slate-400 tracking-wider mb-1">Experience Gauge</span>
              <p className="text-sm font-semibold text-slate-700">{profile.experience} active service</p>
            </div>

            {/* Editable Field Form Inputs */}
            <div className={`p-3 rounded-xl border transition-all ${isEditing ? 'border-teal-300 bg-white ring-2 ring-teal-50' : 'bg-slate-50/80 border-slate-100'}`}>
              <span className="block text-[10px] uppercase text-teal-600 tracking-wider mb-1">Primary Phone Contact</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profile.mobileNumber} 
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className="w-full font-mono text-sm font-bold text-slate-800 bg-transparent border-b border-teal-200 outline-none pb-0.5"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 font-mono flex items-center gap-1.5"><Phone size={12} /> {profile.mobileNumber}</p>
              )}
            </div>

            <div className={`p-3 rounded-xl border transition-all ${isEditing ? 'border-teal-300 bg-white ring-2 ring-teal-50' : 'bg-slate-50/80 border-slate-100'}`}>
              <span className="block text-[10px] uppercase text-teal-600 tracking-wider mb-1">Alternate Backup Phone</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profile.alternateMobile} 
                  onChange={(e) => handleInputChange("alternateMobile", e.target.value)}
                  className="w-full font-mono text-sm font-bold text-slate-800 bg-transparent border-b border-teal-200 outline-none pb-0.5"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 font-mono">{profile.alternateMobile || "None Enlisted"}</p>
              )}
            </div>

            <div className={`p-3 rounded-xl border transition-all sm:col-span-2 ${isEditing ? 'border-teal-300 bg-white ring-2 ring-teal-50' : 'bg-slate-50/80 border-slate-100'}`}>
              <span className="block text-[10px] uppercase text-teal-600 tracking-wider mb-1">Academic Qualifications Dossier</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profile.qualification} 
                  onChange={(e) => handleInputChange("qualification", e.target.value)}
                  className="w-full text-sm font-bold text-slate-800 bg-transparent border-b border-teal-200 outline-none pb-0.5"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><Award size={13} className="text-teal-600" /> {profile.qualification}</p>
              )}
            </div>

            <div className={`p-3 rounded-xl border transition-all sm:col-span-2 ${isEditing ? 'border-teal-300 bg-white ring-2 ring-teal-50' : 'bg-slate-50/80 border-slate-100'}`}>
              <span className="block text-[10px] uppercase text-teal-600 tracking-wider mb-1">Local Residential Address Mapping</span>
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                  <input type="text" value={profile.address} placeholder="Street Address" onChange={(e) => handleInputChange("address", e.target.value)} className="sm:col-span-2 text-xs font-bold p-2 border rounded outline-none" />
                  <input type="text" value={profile.city} placeholder="City" onChange={(e) => handleInputChange("city", e.target.value)} className="text-xs font-bold p-2 border rounded outline-none" />
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><MapPin size={13} /> {profile.address}, {profile.city} - {profile.pincode}</p>
              )}
            </div>

          </div>
        </div>

        {/* ================= SECTION 3: INLINE PASSWORD Swap SYSTEM ================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Lock size={16} className="text-teal-600" /> Reset Security Access Password
            </h3>
          </div>

          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-500">
            {/* Field A: Current Password */}
            <div className="space-y-1 relative">
              <label className="text-[10px] uppercase tracking-wider text-slate-400">Current Security Key</label>
              <input 
                type={showPass.current ? "text" : "password"} 
                value={passwords.current}
                onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                required
                placeholder="••••••••"
                className="w-full font-mono font-bold text-sm bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
              />
              <button type="button" onClick={() => setShowPass(f => ({ ...f, current: !f.current }))} className="absolute right-3 bottom-3 text-slate-400 hover:text-teal-600">
                {showPass.current ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>

            {/* Field B: New Password */}
            <div className="space-y-1 relative">
              <label className="text-[10px] uppercase tracking-wider text-slate-400">New Proposed Key</label>
              <input 
                type={showPass.next ? "text" : "password"} 
                value={passwords.next}
                onChange={(e) => setPasswords(p => ({ ...p, next: e.target.value }))}
                required
                placeholder="••••••••"
                className="w-full font-mono font-bold text-sm bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
              />
              <button type="button" onClick={() => setShowPass(f => ({ ...f, next: !f.next }))} className="absolute right-3 bottom-3 text-slate-400 hover:text-teal-600">
                {showPass.next ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>

            {/* Field C: Confirm Password */}
            <div className="space-y-1 relative">
              <label className="text-[10px] uppercase tracking-wider text-slate-400">Confirm Proposed Key</label>
              <input 
                type={showPass.confirm ? "text" : "password"} 
                value={passwords.confirm}
                onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                required
                placeholder="••••••••"
                className="w-full font-mono font-bold text-sm bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
              />
              <button type="button" onClick={() => setShowPass(f => ({ ...f, confirm: !f.confirm }))} className="absolute right-3 bottom-3 text-slate-400 hover:text-teal-600">
                {showPass.confirm ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>

            {/* Password Trigger Submit Button Row */}
            <div className="sm:col-span-3 flex justify-end pt-2">
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-xs"
              >
                Confirm Account Password Swap
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}