import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricCard({ title, value, trend, trendType, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        <p className={`text-xs font-medium flex items-center gap-1 ${
          trendType === 'up' ? 'text-emerald-600' : trendType === 'down' ? 'text-rose-600' : 'text-gray-400'
        }`}>
          {trendType === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
          {trendType === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
          {trendType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
          {trend}
        </p>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}