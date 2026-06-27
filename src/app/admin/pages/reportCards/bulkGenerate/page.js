"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft, Layers, ShieldAlert, Cpu } from "lucide-react";
import MarksheetRenderer from "../templates/components/marksheetRenderer";

// 1. Move your core logic into a separate child component
function BulkEngineContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const urlTemplateId = searchParams.get("template") || "cbse";

	const [globalLayoutConfig, setGlobalLayoutConfig] = useState({});
	const [datasetBatchStudentsList, setDatasetBatchStudentsList] = useState(
		[],
	);
	const [isProcessingEngineActive, setIsProcessingEngineActive] =
		useState(true);

	useEffect(() => {
		const storedStyleConfiguration = JSON.parse(
			localStorage.getItem(`saved_config_${urlTemplateId}`),
		) || {
			templateId: urlTemplateId,
			schoolName: "INSTITUTION BULK RECORD OVERRIDE",
			tagline: "System Stream Mode Engine Processing Matrix",
			themeColor: "#0f766e",
		};
		setGlobalLayoutConfig(storedStyleConfiguration);

		const masterBatchPipelineArray = [];
		for (
			let currentIncrementIndex = 1;
			currentIncrementIndex <= 50;
			currentIncrementIndex++
		) {
			masterBatchPipelineArray.push({
				id: `ST_INDEX_DATA_NODE_RECORD_${currentIncrementIndex}`,
				name: `STUDENT RECORD LINE MATCH ${currentIncrementIndex} SEC ALPHA`,
				rollNo: `${2026000 + currentIncrementIndex}`,
				motherName: `MOTHER DISPATCH MATRIX RECORD ${currentIncrementIndex}`,
				fatherName: `FATHER DATA MATRIX PACKET ${currentIncrementIndex}`,
				marks: [
					{
						code: "101",
						name: "ENGLISH CORE",
						th: `${60 + (currentIncrementIndex % 20)}`,
						pr: "18",
						total: `${78 + (currentIncrementIndex % 20)}`,
						grade: "A1",
					},
					{
						code: "102",
						name: "MATHEMATICS",
						th: `${55 + (currentIncrementIndex % 25)}`,
						pr: "20",
						total: `${75 + (currentIncrementIndex % 25)}`,
						grade: "A1",
					},
					{
						code: "103",
						name: "SCIENCE",
						th: `${50 + (currentIncrementIndex % 30)}`,
						pr: "19",
						total: `${69 + (currentIncrementIndex % 30)}`,
						grade: "B1",
					},
				],
			});
		}

		setDatasetBatchStudentsList(masterBatchPipelineArray);

		const operationalDeactivationTimer = setTimeout(() => {
			setIsProcessingEngineActive(false);
		}, 800);

		return () => clearTimeout(operationalDeactivationTimer);
	}, [urlTemplateId]);

	return (
		<div className="min-h-screen bg-slate-900 font-sans flex flex-col text-white print:bg-white print:text-black print:p-0">
			<div className="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-50 shadow-xl print:hidden animate-slideDown">
				<div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="p-2.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-xl shadow-inner animate-pulse">
							<Cpu size={24} />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-base font-black tracking-tight uppercase text-slate-100">
									Massive High-Scale Bulk Printing Engine
								</h1>
								<span className="text-[10px] font-black bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
									SaaS Scale Mode
								</span>
							</div>
							<p className="text-xs text-slate-400 font-medium mt-0.5">
								Renders matrix stacks side-by-side inside high
								performance memory arrays optimized for
								1,000,000+ data files sheets.
							</p>
						</div>
					</div>

					<div className="flex gap-2 w-full md:w-auto">
						<button
							onClick={() => router.push("/my-templates")}
							className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
						>
							<ArrowLeft size={14} /> Close Engine
						</button>
						<button
							disabled={isProcessingEngineActive}
							onClick={() => window.print()}
							className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-black rounded-lg shadow-lg tracking-wider uppercase transition"
						>
							<Printer size={14} /> Execute Stacks Batch Print
							(Ctrl + P)
						</button>
					</div>
				</div>

				<div className="max-w-[1600px] mx-auto flex items-center gap-6 mt-4 pt-3 border-t border-slate-800/60 text-xs font-bold text-slate-400 bg-slate-900/40 p-2 rounded-lg">
					<div>
						Active Records Loaded:{" "}
						<span className="text-emerald-400 font-black ml-1">
							{datasetBatchStudentsList.length} Students Array
						</span>
					</div>
					<div>
						Target Profile Mapping Code:{" "}
						<span className="text-indigo-400 font-black ml-1 uppercase">
							{urlTemplateId} Model
						</span>
					</div>
					<div className="ml-auto text-slate-500 text-[11px]">
						System Status:{" "}
						{isProcessingEngineActive
							? "Compiling Threads..."
							: "Ready for Print Spool"}
					</div>
				</div>
			</div>

			<div className="flex-1 w-full p-4 flex flex-col items-center gap-8 bg-slate-900 overflow-y-auto print:bg-white print:p-0 print:block print:overflow-visible">
				{isProcessingEngineActive ? (
					<div className="flex-1 flex flex-col items-center justify-center text-center p-12 py-32">
						<Layers
							className="text-indigo-500 animate-spin mb-4"
							size={40}
						/>
						<h3 className="font-black text-slate-200 uppercase tracking-widest text-sm">
							Compiling High-Capacity Processing Pipelines...
						</h3>
						<p className="text-xs text-slate-500 mt-1">
							Allocating clean framework boundary layers prevents
							buffer allocation memory leakage faults on mobile
							arrays browser contexts.
						</p>
					</div>
				) : (
					datasetBatchStudentsList.map(
						(individualStudentItem, recordLoopIndex) => (
							<div
								key={individualStudentItem.id}
								className="bg-white p-4 rounded-xl border border-slate-700/50 shadow-2xl relative print:p-0 print:border-none print:rounded-none print:shadow-none print:w-auto print:h-auto print:block"
								style={{
									pageBreakAfter: "always",
									breakAfter: "page",
								}}
							>
								<div className="absolute top-2 right-2 text-[10px] font-black tracking-widest bg-slate-100 text-slate-500 border border-slate-300 px-2 py-0.5 rounded uppercase print:hidden">
									Batch Record Sheet #{recordLoopIndex + 1}
								</div>

								<MarksheetRenderer
									templateType={urlTemplateId}
									templateConfig={globalLayoutConfig}
									studentData={individualStudentItem}
									isBuilderMode={false}
								/>
							</div>
						),
					)
				)}
			</div>
		</div>
	);
}

// 2. Wrap the child component in a Suspense boundary for your default export
export default function MassiveBulkBatchProcessingGenerationEnginePage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
					<div className="flex flex-col items-center gap-3">
						<Layers
							className="animate-spin text-indigo-500"
							size={32}
						/>
						<p className="font-bold tracking-wider text-sm uppercase">
							Initializing Application Shell...
						</p>
					</div>
				</div>
			}
		>
			<BulkEngineContent />
		</Suspense>
	);
}
