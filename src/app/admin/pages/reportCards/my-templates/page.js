"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, ArrowLeft, Trash2, Eye, Printer, Layers, UserCheck } from "lucide-react";
import MarksheetRenderer from "../templates/components/marksheetRenderer";

export default function MyTemplatesRepositoryPage() {
  const router = useRouter();
  const [savedLayoutIds, setSavedLayoutIds] = useState([]);
  const [activePreviewId, setActivePreviewId] = useState(null);
  const [activeConfig, setActiveConfig] = useState({});

  // Layout zoom scaling constraints matrix hooks
  const [scale, setScale] = useState(1);
  const [wrapperHeight, setWrapperHeight] = useState("auto");
  const previewContainerRef = useRef(null);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("mySavedTemplates")) || [];
    setSavedLayoutIds(list);
  }, []);

  useEffect(() => {
    if (!activePreviewId) return;
    
    // Fetch individual styles configuration dictionary mapping from memory table pipeline
    const cfg = JSON.parse(localStorage.getItem(`saved_config_${activePreviewId}`)) || {
      schoolName: "INSTITUTION NAME ERROR", themeColor: "#334155"
    };
    setActiveConfig(cfg);

    const fitPreviewScreen = () => {
      const currentWidth = window.innerWidth;
      const baselineBounds = 900;

      if (currentWidth < baselineBounds) {
        const calculatedScale = (currentWidth - 24) / baselineBounds;
        setScale(calculatedScale);
        if (previewContainerRef.current) {
          setWrapperHeight(`${previewContainerRef.current.offsetHeight * calculatedScale}px`);
        }
      } else {
        setScale(1);
        setWrapperHeight("auto");
      }
    };

    fitPreviewScreen();
    const timer = setTimeout(fitPreviewScreen, 200);
    window.addEventListener("resize", fitPreviewScreen);
    return () => {
      window.removeEventListener("resize", fitPreviewScreen);
      clearTimeout(timer);
    };
  }, [activePreviewId]);

  const purgeTemplateFromRepository = (id, event) => {
    event.stopPropagation(); // Blocks parent trigger event loop execution
    const balance = savedLayoutIds.filter(item => item !== id);
    setSavedLayoutIds(balance);
    localStorage.setItem("mySavedTemplates", JSON.stringify(balance));
    localStorage.removeItem(`saved_config_${id}`);
    if (activePreviewId === id) setActivePreviewId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col overflow-x-hidden">
      
      {/* Navigation App Header Segment */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 p-4">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200 shadow-sm">
              <FolderOpen size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight">My Saved Templates Repository</h1>
              <p className="text-xs text-slate-400 font-medium">Manage active layout matrices configured for direct database streaming execution.</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/templates")}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg border border-indigo-200/60 transition-all"
          >
            <ArrowLeft size={14} /> Back to Gallery
          </button>
        </div>
      </div>

      {/* Main Container Switch Wrapper Workspace */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 flex flex-col">
        {activePreviewId ? (
          /* ========================================================
             PREVIEW FRAME ACTIVE - Renders targeted configuration layout 
             ======================================================== */
          <div className="flex flex-col gap-4">
            <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-sm flex flex-wrap justify-between items-center gap-4">
              <button onClick={() => setActivePreviewId(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800">
                ← Close Preview File List
              </button>
              
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => router.push(`/report-card-generate?template=${activePreviewId}`)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow transition"
                >
                  <UserCheck size={14} /> Single Student Generate Workspace
                </button>
                <button
                  onClick={() => router.push(`/bulk-generate?template=${activePreviewId}`)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition"
                >
                  <Printer size={14} /> Process Batch Printing (1000+ Class Load)
                </button>
              </div>
            </div>

            {/* Content Zooming scaling dynamic frame handler wrapper */}
            <div className="w-full flex justify-center overflow-hidden py-4">
              <div style={{ height: wrapperHeight, width: "100%", maxWidth: "900px" }} className="flex justify-center overflow-hidden">
                <div 
                  ref={previewContainerRef}
                  style={{
                    width: "900px", minWidth: "900px",
                    transform: `scale(${scale})`, transformOrigin: "top center"
                  }}
                >
                  <MarksheetRenderer 
                    templateType={activePreviewId}
                    templateConfig={activeConfig}
                    studentData={{}} // General mockup matrix testing schema pipeline shell structure configuration parameters
                    isBuilderMode={false} // Disable controls inside structural components view profile definitions context elements
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             FOLDER EMPTY GRID VIEWS - Standard management lists layout 
             ======================================================== */
          <div className="flex-1 flex flex-col">
            {savedLayoutIds.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white border border-dashed rounded-2xl text-center min-h-[350px]">
                <Layers className="text-slate-300 mb-2" size={44} />
                <h3 className="font-bold text-slate-700">No Saved Framework Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">Configure school options profile elements settings arrays from gallery configuration interface nodes to populate active files indices.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedLayoutIds.map((id) => (
                  <div
                    key={id}
                    onClick={() => setActivePreviewId(id)}
                    className="bg-white border rounded-xl p-4 shadow-sm hover:shadow border-slate-200 hover:border-indigo-400 cursor-pointer flex flex-col justify-between relative transition-all group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-indigo-600 opacity-60"></div>
                    <div className="mt-2">
                      <span className="text-[9px] font-extrabold tracking-widest bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded uppercase">Institutional Layout</span>
                      <h3 className="text-base font-black text-slate-800 mt-3 font-serif uppercase tracking-tight">{id} Configuration Template</h3>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-6">
                      <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600 flex items-center gap-1"><Eye size={13}/> View File</span>
                      <button onClick={(e) => purgeTemplateFromRepository(id, e)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Purge Record Layout"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}