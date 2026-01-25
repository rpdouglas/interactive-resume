import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded w-1/3 md:w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 md:w-1/3"></div>
        <div className="h-20 bg-slate-100 rounded w-full md:w-2/3 mt-4"></div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl border border-slate-200"></div>
        ))}
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
        ))}
      </div>

      {/* Chart & Timeline Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-96 bg-slate-100 rounded-xl border border-slate-200"></div>
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-slate-100 rounded-xl border border-slate-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
