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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
            Global Leaderboard
          </h1>
          <p className="mt-2 text-gray-600">See how you rank against your peers and track your progress.</p>
        </div>
        <button 
          onClick={() => setShowLedger(!showLedger)}
          className={`flex items-center px-4 py-2.5 rounded-lg shadow-sm font-medium transition-colors ${
            showLedger 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <History className="w-5 h-5 mr-2" />
          {showLedger ? 'View Leaderboard' : 'My XP History'}
        </button>
      </div>

      {showLedger ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900">Recent XP Transactions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {ledger.length === 0 ? (
              <div className="p-12 text-center text-gray-500">You haven't earned any XP yet. Start joining challenges!</div>
            ) : (
              ledger.map((entry) => (
                <div key={entry.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-5">
                    <div className={`p-3.5 rounded-full ${entry.transactionType === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {entry.transactionType === 'CREDIT' ? <TrendingUp className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 transform rotate-180" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{entry.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1.5 font-medium">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {new Date(entry.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${entry.transactionType === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.transactionType === 'CREDIT' ? '+' : '-'}{entry.points} XP
                    </span>
                    <p className="text-sm font-medium text-gray-500 mt-1">Balance: {entry.balanceAfter} XP</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-gray-100">Rank</th>
                  <th className="px-6 py-4 border-b border-gray-100">Employee</th>
                  <th className="px-6 py-4 border-b border-gray-100">Department</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No leaderboard data available.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((emp, index) => {
                    const isCurrentUser = user && user.id === emp.id;
                    
                    let rankDisplay = <span className="text-gray-500 font-bold text-lg">{index + 1}</span>;
                    if (index === 0) rankDisplay = <Trophy className="w-7 h-7 text-yellow-500" />;
                    else if (index === 1) rankDisplay = <Medal className="w-7 h-7 text-gray-400" />;
                    else if (index === 2) rankDisplay = <Medal className="w-7 h-7 text-amber-600" />;

                    return (
                      <tr key={emp.id} className={`${isCurrentUser ? 'bg-primary-50 hover:bg-primary-100/50' : 'hover:bg-gray-50'} transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8">
                            {rankDisplay}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-sm ${isCurrentUser ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                              {emp.firstName?.[0]}{emp.lastName?.[0]}
                            </div>
                            <div>
                              <p className={`font-bold text-base ${isCurrentUser ? 'text-primary-700' : 'text-gray-900'}`}>
                                {emp.firstName} {emp.lastName} {isCurrentUser && <span className="text-primary-500 ml-1">(You)</span>}
                              </p>
                              <p className="text-sm font-medium text-gray-500">{emp.currentLevel || 'Level 1'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-600">
                          {emp.department || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="inline-flex items-center font-black text-gray-900 text-xl">
                            {emp.totalXp} <Star className="w-5 h-5 ml-1.5 text-yellow-500 fill-current" />
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
