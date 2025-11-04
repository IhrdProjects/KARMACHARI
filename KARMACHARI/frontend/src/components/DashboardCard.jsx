import React from 'react';

export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-5 text-center">
      <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
        {title}
      </h4>
      <div className="text-3xl font-bold text-[#0071BC]">{value}</div>
    </div>
  );
}
