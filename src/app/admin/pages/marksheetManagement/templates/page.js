"use client";
import React, { useState } from "react";
import { 
  LayoutTemplate, 
  FileBadge, 
  Layers, 
  BookOpen, 
  GraduationCap, 
  Building2,
  Award,
  Palette,
  ClipboardList
} from "lucide-react";

// 📦 Importing All Standard & Premium Templates
import CBSETemplate from "./components/cbse";
import KVTemplate from "./components/kv";
import ModernTemplate from "./components/modern";
// import ICSETemplate from "./components/ICSETemplate";
import StateBoardTemplate from "./components/stateBoard";
import ConventTemplate from "./components/convent";
import CertificateTemplate from "./components/simple";
import XaviersTemplate from "./components/oxeford";

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("cbse");

  // 🗂️ Master Array for all Template Tabs
  const tabs = [
    { id: "cbse", label: "Standard CBSE" },
    { id: "xaviers", label: "Detailed CBSE" },
    { id: "modern", label: "Modern & Dynamic" },
    // { id: "icse", label: "ICSE / Premium" },
    { id: "state", label: "State Board" },
    { id: "convent", label: "Primary Convent" },
    { id: "certificate", label: "Certificate Style" },
    { id: "kv", label: "KV Format" },
  ];

  // 🎨 Safe rendering function for icons (Fixes Turbopack object error)
  const renderIcon = (id, isActive) => {
    const iconClass = isActive ? "text-indigo-600" : "text-slate-400";
    switch (id) {
      case "cbse": return <BookOpen size={16} className={iconClass} />;
      case "xaviers": return <ClipboardList size={16} className={iconClass} />;
      case "modern": return <Layers size={16} className={iconClass} />;
      // case "icse": return <GraduationCap size={16} className={iconClass} />;
      case "state": return <FileBadge size={16} className={iconClass} />;
      case "convent": return <Palette size={16} className={iconClass} />;
      case "certificate": return <Award size={16} className={iconClass} />;
      case "kv": return <Building2 size={16} className={iconClass} />;
      default: return null;
    }
  };

  // 🖥️ Dynamic Component Renderer
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "cbse": return <CBSETemplate />;
      case "xaviers": return <XaviersTemplate />;
      case "modern": return <ModernTemplate />;
      // case "icse": return <ICSETemplate />;
      case "state": return <StateBoardTemplate />;
      case "convent": return <ConventTemplate />;
      case "certificate": return <CertificateTemplate />;
      case "kv": return <KVTemplate />;
      default: return <CBSETemplate />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* 🌟 Premium Header & Navigation */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-5 gap-4">
            
            {/* Title Section */}
            <div>
              <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                <LayoutTemplate className="text-indigo-600" size={28} />
                Marksheet Template Gallery
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Choose and customize standard report card layouts for your institution.
              </p>
            </div>

            {/* Premium Pill Tabs - Scrollable */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto custom-scrollbar max-w-full">
              {tabs.map((tab) => {
                const isActive = selectedTemplate === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTemplate(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "bg-white text-indigo-700 shadow-sm border border-slate-200/50"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                    }`}
                  >
                    {renderIcon(tab.id, isActive)}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 Active Template Rendering Area */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto pb-12">
        <div className="bg-white min-h-[calc(100vh-100px)] shadow-[0_0_40px_-15px_rgba(0,0,0,0.05)] border-x border-slate-200 overflow-hidden">
          {renderTemplate()}
        </div>
      </div>

    </div>
  );
}