import React, { useState, useEffect } from 'react';
import { Award, Calendar, CheckCircle, Clock } from 'lucide-react';
import gamificationApi from '../../services/gamification.api';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await gamificationApi.getChallenges({ status: 'ACTIVE' });
      setChallenges(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      await gamificationApi.joinChallenge(id);
      alert('Successfully joined the challenge!');
      fetchChallenges();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join challenge');
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
          <h1 className="text-3xl font-display font-bold text-text-main">Active Challenges</h1>
          <p className="mt-2 text-text-muted">Take on challenges to earn XP, unlock badges, and climb the leaderboard.</p>
        </div>
      </div>

      {challenges.length === 0 ? (
        <div className="bg-app-card rounded-2xl border border-border-soft p-12 text-center text-text-muted shadow-soft">
          No active challenges available right now. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className="bg-app-card rounded-2xl shadow-soft border border-border-soft overflow-hidden hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
            >
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-3.5 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                    challenge.difficulty === 'EASY' ? 'bg-state-success/10 text-state-success' :
                    challenge.difficulty === 'MEDIUM' ? 'bg-state-warning/10 text-state-warning' :
                    'bg-state-error/10 text-state-error'
                  }`}>
                    {challenge.difficulty}
                  </span>
                  <span className="flex items-center text-coral font-bold bg-coral/10 px-3.5 py-1.5 rounded-full text-sm shadow-sm">
                    <Award className="w-4 h-4 mr-1.5" />
                    {challenge.xpReward} XP
                  </span>
                </div>
                
                <h3 className="text-xl font-display font-bold text-text-main mb-3">{challenge.title}</h3>
                <p className="text-text-muted text-sm mb-8 flex-1 line-clamp-3 leading-relaxed">
                  {challenge.description}
                </p>
                
                <div className="flex items-center text-xs font-medium text-text-muted mb-8 bg-app-bg p-4 rounded-xl border border-border-soft">
                  <Clock className="w-4 h-4 mr-2 text-mauve" />
                  Ends: {new Date(challenge.deadline).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                <button 
                  onClick={() => handleJoin(challenge.id)}
                  className="w-full py-3.5 bg-coral hover:bg-coral-dark text-white font-semibold rounded-xl transition-all duration-250 hover:scale-[1.02] shadow-sm flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2 opacity-90" />
                  Join Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
