import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [resultsData, setResultsData] = useState(location.state?.resultsData || null);
  const [requestData] = useState(location.state?.requestData || null);
  const [isLoading, setIsLoading] = useState(!location.state?.resultsData);
  const [loadingMsg, setLoadingMsg] = useState("Simulating 4 defendants...");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!requestData) return;
    
    if (!resultsData && isLoading) {
      const timer1 = setTimeout(() => setLoadingMsg("Consulting AI risk model..."), 1000);
      const timer2 = setTimeout(() => setLoadingMsg("Calculating bias score..."), 2000);

      const runSimulation = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
          const response = await fetch(`${API_URL}/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
          });
          
          if (!response.ok) throw new Error('Simulation request failed');
          
          const data = await response.json();
          setResultsData(data);
        } catch (err) {
          setError(err.message || 'An error occurred during simulation.');
        } finally {
          setIsLoading(false);
          clearTimeout(timer1);
          clearTimeout(timer2);
        }
      };

      runSimulation();
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [requestData, resultsData, isLoading]);

  if (!requestData) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 py-20 relative z-10">
        <div className="relative w-32 h-32 mb-10">
          <div className="absolute inset-0 rounded-full border-t-4 border-red-500/80 animate-[spin_1.5s_ease-in-out_infinite] shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
          <div className="absolute inset-2 rounded-full border-b-4 border-slate-500/50 animate-[spin_2s_linear_infinite_reverse]"></div>
          <div className="absolute inset-4 rounded-full bg-slate-900/80 backdrop-blur-sm shadow-inner flex items-center justify-center text-red-500 font-black font-display text-2xl tracking-widest">AI</div>
        </div>
        <h2 className="text-3xl font-black font-display text-white mb-3 animate-pulse text-center tracking-tight">{loadingMsg}</h2>
        <p className="text-slate-400 text-center text-lg font-light">Please wait while JudgeMe analyzes the case details.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 py-20">
        <div className="bg-red-900/20 border-l-4 border-red-500 p-6 max-w-lg rounded-xl text-center">
          <h2 className="text-red-500 font-bold text-xl mb-2">Simulation Failed</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const { bias_score, results } = resultsData;
  const isHighBias = bias_score > 3;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
      
      {/* Bias Score Banner */}
      <div className={`rounded-2xl p-8 mb-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-between border border-white/10 ${isHighBias ? 'bg-gradient-to-r from-slate-900/90 to-red-950/40 backdrop-blur-xl' : 'bg-gradient-to-r from-slate-900/90 to-emerald-950/40 backdrop-blur-xl'}`}>
        <div className="mb-6 sm:mb-0 text-center sm:text-left flex-grow">
          <h2 className="text-2xl font-black font-display text-white mb-2 uppercase tracking-widest flex items-center justify-center sm:justify-start">
            {isHighBias ? (
              <><span className="w-3 h-3 rounded-full bg-red-500 mr-3 animate-pulse"></span> Significant Bias Detected</>
            ) : (
              <><span className="w-3 h-3 rounded-full bg-emerald-500 mr-3"></span> Low Bias Detected</>
            )}
          </h2>
          <p className="text-slate-300 text-base font-light max-w-xl">
            The AI assigned different risk scores despite the base facts being identical.
          </p>
        </div>
        <div className="text-center sm:text-right flex flex-col items-center sm:items-end border-t sm:border-t-0 sm:border-l border-white/10 pt-6 sm:pt-0 sm:pl-8">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Disparity Score</span>
          <div className={`text-6xl font-black font-display drop-shadow-lg ${isHighBias ? 'text-red-500' : 'text-emerald-500'}`}>
            {bias_score}
          </div>
        </div>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black font-display text-white mb-6 tracking-tight drop-shadow-lg">The Verdict</h1>
        <div className="inline-block bg-white/5 backdrop-blur-md rounded-xl px-6 sm:px-8 py-4 border border-white/10 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base">
            <span className="text-slate-300 font-light"><span className="font-bold text-white tracking-wide uppercase text-xs mr-2 text-slate-500">Case</span> {requestData.crime}</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-slate-300 font-light"><span className="font-bold text-white tracking-wide uppercase text-xs mr-2 text-slate-500">Priors</span> {requestData.priors}</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-slate-300 font-light"><span className="font-bold text-white tracking-wide uppercase text-xs mr-2 text-slate-500">Employment</span> {requestData.employment}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {results.map((defendant, idx) => (
          <ScoreCard key={idx} defendant={defendant} />
        ))}
      </div>

      {/* What does this mean section */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <h3 className="text-3xl font-black font-display text-white mb-4">What does this mean?</h3>
        <p className="text-slate-300 leading-relaxed text-lg font-light mb-8 max-w-4xl relative z-10">
          A bias score higher than 3 indicates that the AI is treating identical defendants differently based purely on socioeconomic proxies like income and neighbourhood. Real-world risk assessment tools often produce similar disparities, resulting in harsher sentences for defendants from marginalized backgrounds despite committing the exact same crime.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:justify-start relative z-10">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("URL copied to clipboard!");
            }}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share this case
          </button>
        </div>
      </div>

      <div className="text-center pb-16">
        <button 
          onClick={() => navigate('/')}
          className="bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-semibold py-4 px-10 border border-slate-600 hover:border-slate-400 rounded-xl transition-all duration-300 tracking-wide uppercase text-sm"
        >
          ← Try another case
        </button>
      </div>

    </div>
  );
};

export default ResultsPage;
