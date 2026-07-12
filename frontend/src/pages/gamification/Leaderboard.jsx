import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, TrendingUp, Clock, History } from 'lucide-react';
import gamificationApi from '../../services/gamification.api';
import { useAuth } from '../../context/AuthContext';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLedger, setShowLedger] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lbRes, ledgerRes] = await Promise.all([
        gamificationApi.getLeaderboard({ limit: 50 }),
        gamificationApi.getMyXpLedger({ limit: 15 })
      ]);
      setLeaderboard(lbRes.data.data.data || []);
      setLedger(ledgerRes.data.data.data || []);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-main flex items-center">
            <Trophy className="w-8 h-8 mr-3 text-coral" />
            Global Leaderboard
          </h1>
          <p className="mt-2 text-text-muted">See how you rank against your peers and track your progress.</p>
        </div>
        <button 
          onClick={() => setShowLedger(!showLedger)}
          className={`flex items-center px-5 py-3 rounded-xl shadow-soft font-medium transition-all duration-250 hover:scale-[1.02] ${
            showLedger 
              ? 'bg-sage text-white' 
              : 'bg-app-card border border-border-soft text-text-main hover:bg-cream'
          }`}
        >
          <History className={`w-5 h-5 mr-2 ${showLedger ? 'text-white' : 'text-mauve'}`} />
          {showLedger ? 'View Leaderboard' : 'My XP History'}
        </button>
      </div>

      {showLedger ? (
        <div className="bg-app-card rounded-2xl shadow-soft border border-border-soft overflow-hidden">
          <div className="px-8 py-6 border-b border-border-soft bg-app-bg flex items-center">
            <TrendingUp className="w-5 h-5 mr-3 text-coral" />
            <h2 className="text-lg font-display font-bold text-text-main">Recent XP Transactions</h2>
          </div>
          <div className="divide-y divide-border-soft">
            {ledger.length === 0 ? (
              <div className="p-16 text-center text-text-muted">You haven't earned any XP yet. Start joining challenges!</div>
            ) : (
              ledger.map((entry) => (
                <div key={entry.id} className="p-8 flex items-center justify-between hover:bg-cream/40 transition-colors duration-250">
                  <div className="flex items-center space-x-6">
                    <div className={`p-4 rounded-2xl ${entry.transactionType === 'CREDIT' ? 'bg-state-success/10 text-state-success' : 'bg-state-error/10 text-state-error'}`}>
                      {entry.transactionType === 'CREDIT' ? <TrendingUp className="w-6 h-6" /> : <TrendingUp className="w-6 h-6 transform rotate-180" />}
                    </div>
                    <div>
                      <p className="font-bold text-text-main text-lg">{entry.description}</p>
                      <div className="flex items-center text-sm text-text-muted mt-2 font-medium">
                        <Clock className="w-4 h-4 mr-2 text-mauve" />
                        {new Date(entry.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-display font-bold ${entry.transactionType === 'CREDIT' ? 'text-state-success' : 'text-state-error'}`}>
                      {entry.transactionType === 'CREDIT' ? '+' : '-'}{entry.points} XP
                    </span>
                    <p className="text-sm font-medium text-text-muted mt-2">Balance: {entry.balanceAfter} XP</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="bg-app-card rounded-2xl shadow-soft border border-border-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-peach/20 text-left text-xs font-bold text-text-muted uppercase tracking-wider">
                  <th className="px-8 py-5 border-b border-border-soft">Rank</th>
                  <th className="px-8 py-5 border-b border-border-soft">Employee</th>
                  <th className="px-8 py-5 border-b border-border-soft">Department</th>
                  <th className="px-8 py-5 border-b border-border-soft text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center text-text-muted">
                      No leaderboard data available.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((emp, index) => {
                    const isCurrentUser = user && user.id === emp.id;
                    
                    let rankDisplay = <span className="text-text-muted font-display font-bold text-lg">{index + 1}</span>;
                    if (index === 0) rankDisplay = <Trophy className="w-7 h-7 text-[#F5C75D]" />; // Using warning color as gold
                    else if (index === 1) rankDisplay = <Medal className="w-7 h-7 text-mauve" />;
                    else if (index === 2) rankDisplay = <Medal className="w-7 h-7 text-peach" />;

                    return (
                      <tr key={emp.id} className={`${isCurrentUser ? 'bg-sage/10' : 'hover:bg-cream/40'} transition-colors duration-250`}>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8">
                            {rankDisplay}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm mr-5 shadow-sm ${isCurrentUser ? 'bg-coral text-white' : 'bg-app-bg text-text-main border border-border-soft'}`}>
                              {emp.firstName?.[0]}{emp.lastName?.[0]}
                            </div>
                            <div>
                              <p className={`font-bold text-base ${isCurrentUser ? 'text-coral' : 'text-text-main'}`}>
                                {emp.firstName} {emp.lastName} {isCurrentUser && <span className="text-coral ml-1.5">(You)</span>}
                              </p>
                              <p className="text-sm font-medium text-text-muted mt-0.5">{emp.currentLevel || 'Level 1'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap font-medium text-text-muted">
                          {emp.department || 'N/A'}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right">
                          <span className="inline-flex items-center font-display font-bold text-text-main text-xl">
                            {emp.totalXp} <Star className="w-5 h-5 ml-2 text-coral fill-current" />
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
