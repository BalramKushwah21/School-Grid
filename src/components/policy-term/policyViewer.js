// src/components/policy-term/policyViewer.js
"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function PolicyViewer({ fileName, title }) {
  const [policyText, setPolicyText] = useState("Loading...");

  useEffect(() => {
    fetch(`/${fileName}`)
      .then((res) => res.text())
      .then((data) => setPolicyText(data))
      .catch(() => setPolicyText("Failed to load content."));
  }, [fileName]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-10 border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 border-b pb-3 text-gray-800">{title}</h1>
      <div className="prose max-w-none text-gray-600 leading-relaxed text-sm md:text-base">
        <ReactMarkdown>{policyText}</ReactMarkdown>
      </div>
    </div>
  );
}