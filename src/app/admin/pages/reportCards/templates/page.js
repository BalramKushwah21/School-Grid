"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LayoutTemplate, Save, FolderLock, Sparkles, Palette } from "lucide-react";
import MarksheetRenderer from "./components/marksheetRenderer";

export default function TemplatesGalleryPage() {
  const router = useRouter();
  const [selectedLayout, setSelectedTemplate] = useState("cbse");
  const [schoolName, setSchoolName] = useState("CAMBRIDGE PUBLIC SCHOOL");
  const [tagline, setTagline] = useState("Affiliated to C.B.S.E., New Delhi");
  const [colorTheme, setColorTheme] = useState("#b91c1c");

  // Mobile viewport layout constraints calculation states
  const [scale, setScale] = useState(1);
  const [wrapperHeight, setWrapperHeight] = useState("auto");
  const workspaceRef = useRef(null);

  const availableLayouts = [
    { id: "cbse", name: "Standard CBSE Format", desc: "Classic dual double border structure" },
    { id: "modern", name: "Modern Elite Theme", desc: "Clean block header structural elements" }
  ];

  // Auto layout frame matrix tracking hook for responsive mobile configurations
  useEffect(() => {
    const handleViewportScale = () => {
      const windowWidth = window.innerWidth;
      const blueprintWidth = 900; 

      if (windowWidth < blueprintWidth) {
        const calculatedScale = (windowWidth - 24) / blueprintWidth; 
        setScale(calculatedScale);
        if (workspaceRef.current) {
          setWrapperHeight(`${workspaceRef.current.offsetHeight * calculatedScale}px`);
        }
      } else {
        setScale(1);
        setWrapperHeight("auto");
      }
    };

    handleViewportScale();
    const timeout = setTimeout(handleViewportScale, 200);
    window.addEventListener("resize", handleViewportScale);
    return () => {
      window.removeEventListener("resize", handleViewportScale);
      clearTimeout(timeout);
    };
  }, [selectedLayout, schoolName, tagline, colorTheme]);

  const commitTemplateConfiguration = () => {
    // Large enterprise storage simulation layer
    const configPayload = {
      templateId: selectedLayout,
      schoolName: schoolName,
      tagline: tagline,
      themeColor: colorTheme,
      updatedTimestamp: Date.now()
    };

    // Commit payload packet to standard relational local storage database wrapper context
    localStorage.setItem(`saved_config_${selectedLayout}`, JSON.stringify(configPayload));

    // Master lookup tables optimization arrays layer
    const activeRegistry = JSON.parse(localStorage.getItem("mySavedTemplates")) || [];
    if (!activeRegistry.includes(selectedLayout)) {
      activeRegistry.push(selectedLayout);
      localStorage.setItem("mySavedTemplates", JSON.stringify(activeRegistry));
    }

    alert("🎉 Layout settings configured successfully! Stored in My Templates.");
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col overflow-x-hidden">
      
      {/* 🌟 Interactive Dashboard Action Panel Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 p-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
              <LayoutTemplate className="text-indigo-600" size={24} />
              SaaS Marksheet Builder Engine
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Customize global styling models for millions of database metrics.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={commitTemplateConfiguration}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all shadow active:scale-95"
            >
              <Save size={16} /> Save Configuration
            </button>
            <button
              onClick={() => router.push("/my-templates")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-sm transition-all shadow active:scale-95"
            >
              <FolderLock size={16} /> My Saved Templates
            </button>
          </div>
        </div>

        {/* 🎨 Live Configuration Workspace Control Variables Form Inputs */}
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl">
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">School Name Label</label>
            <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full text-xs font-bold p-2 border rounded-lg outline-none bg-white focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">Tagline/Sub-Header</label>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full text-xs font-bold p-2 border rounded-lg outline-none bg-white focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">Theme Accent Accent</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={colorTheme} onChange={(e) => setColorTheme(e.target.value)} className="w-10 h-8 rounded cursor-pointer border p-0 bg-transparent" />
              <span className="font-mono text-xs text-slate-600 font-bold uppercase">{colorTheme}</span>
            </div>
          </div>
        </div>

        {/* 🌟 Dynamic Layout Selector Filter Selection Row */}
        <div className="max-w-[1600px] mx-auto flex gap-2 overflow-x-auto mt-4 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {availableLayouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setSelectedTemplate(layout.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap text-left border transition-all duration-300 ${
                selectedLayout === layout.id 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <div className="font-black flex items-center gap-1">
                <Palette size={13} /> {layout.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 Live Preview Workspace Container Area */}
      <div className="flex-1 w-full flex justify-center p-3 sm:p-6 overflow-hidden">
        <div style={{ height: wrapperHeight, width: "100%" }} className="flex justify-center overflow-hidden">
          <div 
            ref={workspaceRef}
            style={{
              width: "900px",
              minWidth: "900px",
              transform: `scale(${scale})`,
              transformOrigin: "top center"
            }}
            className="h-fit"
          >
            <MarksheetRenderer 
              templateType={selectedLayout}
              templateConfig={{ schoolName, tagline, themeColor: colorTheme }}
              studentData={{}} // Empty dummy object structure passed for layout shell builder configuration testing
              isBuilderMode={true} // Enables row insertion/deletion controls natively
            />
          </div>
        </div>
      </div>

    </div>
  );
}