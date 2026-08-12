import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    crime: '',
    priors: 'None',
    employment: 'Employed',
    base_income: '₹12L/yr', 
    base_age: "28",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/results', { state: { requestData: formData } });
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center justify-center w-full relative">
      <div className="max-w-3xl w-full text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black font-display text-white mb-6 tracking-tight drop-shadow-lg">JudgeMe</h1>
        <p className="text-xl md:text-2xl text-slate-300 italic font-light">"Same crime. Different face. Different fate."</p>
      </div>
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] p-8 md:p-10 max-w-2xl w-full transition-all duration-300 hover:shadow-[0_8px_40px_0_rgba(225,29,72,0.1)]">
        <h2 className="text-2xl font-bold font-display mb-8 text-white border-b border-white/10 pb-4">Enter Case Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Crime Description</label>
            <textarea 
              name="crime"
              required
              rows="3"
              className="w-full px-5 py-4 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all outline-none resize-none shadow-inner"
              placeholder="e.g. Theft of goods worth ₹500, first offence"
              value={formData.crime}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Prior Offences</label>
              <select 
                name="priors"
                className="w-full px-5 py-4 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all outline-none shadow-inner appearance-none cursor-pointer"
                value={formData.priors}
                onChange={handleChange}
              >
                <option className="bg-slate-800 text-white" value="None">None</option>
                <option className="bg-slate-800 text-white" value="1 prior">1 prior</option>
                <option className="bg-slate-800 text-white" value="2+ priors">2+ priors</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Employment Status</label>
              <select 
                name="employment"
                className="w-full px-5 py-4 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all outline-none shadow-inner appearance-none cursor-pointer"
                value={formData.employment}
                onChange={handleChange}
              >
                <option className="bg-slate-800 text-white" value="Employed">Employed</option>
                <option className="bg-slate-800 text-white" value="Unemployed">Unemployed</option>
                <option className="bg-slate-800 text-white" value="Student">Student</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Defendant Age</label>
            <input 
              type="number" 
              name="base_age"
              min="18"
              max="60"
              required
              className="w-full px-5 py-4 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all outline-none shadow-inner"
              value={formData.base_age}
              onChange={handleChange}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-4 px-6 rounded-xl text-white font-bold font-display text-lg shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] mt-4"
          >
            Run simulation
          </button>
        </form>
      </div>
      
      <div className="mt-16 max-w-3xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-lg transition-transform hover:-translate-y-1 duration-300">
        <h3 className="text-xl font-bold font-display text-white mb-3">About JudgeMe</h3>
        <p className="text-slate-400 leading-relaxed font-light">
          JudgeMe exposes how AI risk assessment tools used in courts produce different outcomes for identical crimes when defendant demographics change. This is a demonstration built for the Google Solution Challenge 2026.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
