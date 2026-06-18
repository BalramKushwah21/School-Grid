"use client"
import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const ResultAnalysis = () => {
  // Filter state for dynamic viewing
  const [filters, setFilters] = useState({
    academicYear: '2026-2027',
    examType: 'Mid-Term',
  });

  // Mock Data: Class-wise comparison
  const classComparisonData = [
    { name: 'Class 10-A', avgScore: 82, passPercentage: 95 },
    { name: 'Class 10-B', avgScore: 76, passPercentage: 88 },
    { name: 'Class 11-Sci', avgScore: 85, passPercentage: 98 },
    { name: 'Class 11-Com', avgScore: 79, passPercentage: 92 },
  ];

  // Mock Data: Exam-wise / Year-over-Year comparison
  const yearlyTrendData = [
    { exam: 'Unit Test 1', currentYear: 78, lastYear: 75 },
    { exam: 'Mid-Term', currentYear: 81, lastYear: 79 },
    { exam: 'Unit Test 2', currentYear: 84, lastYear: 80 },
    { exam: 'Finals', currentYear: 0, lastYear: 83 }, // Current year finals haven't happened yet
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    // TODO: Trigger API fetch for new dashboard data based on filters
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Result Analysis Dashboard</h1>
          <p className="text-gray-600">Visualize academic performance across classes and academic years.</p>
        </div>
        
        {/* FILTERS */}
        <div className="flex space-x-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Academic Year</label>
            <select name="academicYear" value={filters.academicYear} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 bg-white">
              <option value="2026-2027">2026-2027</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Exam Term</label>
            <select name="examType" value={filters.examType} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 bg-white">
              <option value="Mid-Term">Mid-Term</option>
              <option value="Finals">Finals</option>
              <option value="Overall">Overall Average</option>
            </select>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">School Average Score</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">80.5%</span>
            <span className="text-sm font-medium text-green-600">↑ 2.1% from last year</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overall Pass Rate</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">93.2%</span>
            <span className="text-sm font-medium text-green-600">↑ 1.5% from last year</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Top Performing Class</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">Class 11-Sci</span>
            <span className="text-sm font-medium text-gray-500">Avg: 85%</span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Class-wise Comparison */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Class-wise Performance Comparison</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{fill: '#F3F4F6'}}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="avgScore" name="Average Score (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="passPercentage" name="Pass Rate (%)" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Year over Year Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Exam-wise Trend (Vs. Last Year)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="exam" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="currentYear" name="Current Year Avg" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="lastYear" name="Last Year Avg" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultAnalysis;