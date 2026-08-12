import React from 'react';

const ScoreCard = ({ defendant }) => {
  const { income, neighbourhood, risk_score, recommendation, reasoning, profile_id } = defendant;
  
  let scoreColor = "text-green-500";
  if (risk_score >= 7) scoreColor = "text-red-600";
  else if (risk_score >= 4) scoreColor = "text-amber-500";

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_0_rgba(0,0,0,0.5)]">
      <div className="mb-6 pb-6 border-b border-white/10">
        <h3 className="text-2xl font-bold font-display text-white mb-1 tracking-tight">Defendant {String.fromCharCode(64 + profile_id)}</h3>
        <p className="text-slate-400 text-sm font-medium tracking-wide">{income} <span className="mx-2 text-slate-600">•</span> {neighbourhood}</p>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <span className="text-slate-300 font-semibold tracking-wide uppercase text-sm">Risk Score</span>
        <span className={`text-5xl font-black font-display drop-shadow-md ${scoreColor}`}>{risk_score}<span className="text-2xl text-slate-500 font-medium">/10</span></span>
      </div>
      
      <div className="mb-6 flex-grow">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Recommendation</h4>
        <p className="text-white text-lg leading-relaxed font-light">{recommendation}</p>
      </div>
      
      <div className="mt-auto bg-black/20 rounded-xl p-4 border border-white/5">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          AI Reasoning
        </h4>
        <p className="text-slate-400 text-xs leading-relaxed font-light">{reasoning}</p>
      </div>
    </div>
  );
};

export default ScoreCard;
