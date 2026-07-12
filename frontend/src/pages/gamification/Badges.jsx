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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
      </div>
    );
  }

  // Create a Set of earned badge IDs for quick lookup
  const earnedBadgeIds = new Set(myBadges.map(mb => mb.badgeId));

  return (
    <div className="max-w-7xl mx-auto p-2">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-text-main flex items-center">
          <Award className="w-8 h-8 mr-3 text-sage" />
          Badges & Achievements
        </h1>
        <p className="mt-2 text-text-muted">Earn badges by participating in challenges and accumulating XP.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {badges.map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id);
          
          return (
            <div 
              key={badge.id}
              className={`relative bg-app-card rounded-2xl border p-8 flex flex-col items-center text-center transition-all duration-300 ${
                isEarned 
                  ? 'border-coral/20 shadow-soft hover:shadow-hover transform hover:-translate-y-1' 
                  : 'border-border-soft shadow-sm opacity-60 hover:opacity-100 hover:shadow-soft'
              }`}
            >
              {isEarned && (
                <div className="absolute top-4 right-4 text-state-success bg-white rounded-full">
                  <CheckCircle className="w-6 h-6" />
                </div>
              )}
              
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-5 shadow-inner transition-colors duration-300 ${
                isEarned ? 'bg-sage/10 text-sage' : 'bg-app-bg text-text-muted'
              }`}>
                {badge.iconUrl ? (
                  <img src={badge.iconUrl} alt={badge.name} className="w-14 h-14 object-contain" />
                ) : (
                  <Award className="w-12 h-12" />
                )}
              </div>
              
              <h3 className={`font-display font-bold mb-3 ${isEarned ? 'text-text-main' : 'text-text-muted'}`}>
                {badge.name}
              </h3>
              
              <p className="text-sm text-text-muted line-clamp-3 mb-6 flex-1 leading-relaxed">
                {badge.description}
              </p>
              
              <div className="mt-auto w-full pt-4 border-t border-border-soft">
                {badge.bonusXp > 0 && (
                  <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full ${
                    isEarned ? 'bg-peach/20 text-[#D97D4B]' : 'bg-app-bg text-text-muted'
                  }`}>
                    +{badge.bonusXp} XP Bonus
                  </span>
                )}
                {!isEarned && (
                  <div className="flex items-center justify-center mt-4 text-sm font-medium text-text-muted">
                    <Lock className="w-4 h-4 mr-1.5 text-mauve" />
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
