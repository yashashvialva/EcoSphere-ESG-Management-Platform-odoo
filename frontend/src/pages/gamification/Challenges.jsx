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
      // Based on our paginated response format: { data: { data: [...] } }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
          <p className="mt-2 text-gray-600">Take on challenges to earn XP, unlock badges, and climb the leaderboard.</p>
        </div>
      </div>

      {challenges.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm">
          No active challenges available right now. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    challenge.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                    challenge.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {challenge.difficulty}
                  </span>
                  <span className="flex items-center text-primary-700 font-bold bg-primary-50 px-3 py-1 rounded-full text-sm shadow-sm">
                    <Award className="w-4 h-4 mr-1.5" />
                    {challenge.xpReward} XP
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{challenge.title}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                  {challenge.description}
                </p>
                
                <div className="flex items-center text-xs font-medium text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  Ends: {new Date(challenge.deadline).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                <button 
                  onClick={() => handleJoin(challenge.id)}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2 opacity-80" />
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
