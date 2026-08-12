import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/history`);
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err.message || 'Error fetching history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleView = (caseData) => {
    navigate('/results', {
      state: {
        resultsData: { bias_score: caseData.bias_score, results: caseData.profiles },
        requestData: caseData.request || { crime: caseData.crime, priors: 'Unknown', employment: 'Unknown' }
      }
    });
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
      <div className="mb-12 text-center sm:text-left">
        <h1 className="text-4xl font-black font-display text-white mb-3 tracking-tight drop-shadow-md">Past Cases</h1>
        <p className="text-slate-400 text-lg font-light">Review previous AI sentencing simulations and their bias scores.</p>
      </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-t-2 border-red-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border-l-4 border-red-500 p-6 mb-6 text-red-400 rounded-xl backdrop-blur-md">
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-16 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/5">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-3 tracking-tight">No cases run yet.</h3>
            <p className="text-slate-400 mb-8 font-light max-w-md mx-auto">Be the first to run a simulation and expose algorithmic bias in the legal system.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(225,29,72,0.5)]"
            >
              Run a simulation
            </button>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-black/20">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Crime Description</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Bias Score</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 bg-slate-800">
                  {history.map((item, idx) => {
                    const isHighBias = item.bias_score > 3;
                    let dateStr = 'Unknown date';
                    if (item.timestamp) {
                      try {
                        const d = new Date(item.timestamp);
                        if (!isNaN(d.getTime())) {
                          dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        } else {
                          dateStr = item.timestamp.split('.')[0] || item.timestamp;
                        }
                      } catch (e) {
                        dateStr = String(item.timestamp);
                      }
                    }

                    return (
                      <tr key={idx} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400 font-light">
                          {dateStr}
                        </td>
                        <td className="px-6 py-5 text-sm text-white max-w-md truncate font-medium">
                          {item.crime}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isHighBias ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                            {item.bias_score}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleView(item)}
                            className="text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-lg transition-all opacity-70 group-hover:opacity-100"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
  );
};

export default HistoryPage;
