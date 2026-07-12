import React, { useState, useEffect } from 'react';
import { Award, Lock, CheckCircle } from 'lucide-react';
import gamificationApi from '../../services/gamification.api';

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const [myBadges, setMyBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [badgesRes, myBadgesRes] = await Promise.all([
        gamificationApi.getAllBadges({ limit: 100 }),
        gamificationApi.getMyBadges({ limit: 100 })
      ]);
      setBadges(badgesRes.data.data.data || []);
      setMyBadges(myBadgesRes.data.data.data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
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

  // Create a Set of earned badge IDs for quick lookup
  const earnedBadgeIds = new Set(myBadges.map(mb => mb.badgeId));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Award className="w-8 h-8 mr-3 text-primary-600" />
          Badges & Achievements
        </h1>
        <p className="mt-2 text-gray-600">Earn badges by participating in challenges and accumulating XP.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {badges.map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id);
          
          return (
            <div 
              key={badge.id}
              className={`relative bg-white rounded-2xl border p-6 flex flex-col items-center text-center transition-all duration-300 ${
                isEarned 
                  ? 'border-primary-200 shadow-md hover:shadow-lg transform hover:-translate-y-1' 
                  : 'border-gray-100 shadow-sm opacity-75 grayscale hover:grayscale-0 hover:opacity-100'
              }`}
            >
              {isEarned && (
                <div className="absolute top-3 right-3 text-green-500 bg-white rounded-full">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
              
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-inner ${
                isEarned ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {badge.iconUrl ? (
                  <img src={badge.iconUrl} alt={badge.name} className="w-12 h-12 object-contain" />
                ) : (
                  <Award className="w-10 h-10" />
                )}
              </div>
              
              <h3 className={`font-bold mb-2 ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
                {badge.name}
              </h3>
              
              <p className="text-xs text-gray-500 line-clamp-3 mb-4 flex-1">
                {badge.description}
              </p>
              
              <div className="mt-auto w-full pt-3 border-t border-gray-50">
                {badge.bonusXp > 0 && (
                  <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                    isEarned ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    +{badge.bonusXp} XP Bonus
                  </span>
                )}
                {!isEarned && (
                  <div className="flex items-center justify-center mt-3 text-xs font-medium text-gray-400">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
