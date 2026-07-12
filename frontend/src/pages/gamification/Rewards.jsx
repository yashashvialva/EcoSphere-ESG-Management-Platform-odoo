import React, { useState, useEffect } from 'react';
import { Gift, Star, ShoppingBag, Clock } from 'lucide-react';
import gamificationApi from '../../services/gamification.api';
import { useAuth } from '../../store/authStore';

export default function Rewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rewardsRes, historyRes] = await Promise.all([
        gamificationApi.getRewards({ status: 'ACTIVE', limit: 50 }),
        gamificationApi.getMyRedemptions({ limit: 20 })
      ]);
      setRewards(rewardsRes.data.data.data || []);
      setRedemptions(historyRes.data.data.data || []);
    } catch (error) {
      console.error('Error fetching rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward) => {
    if (!window.confirm(`Are you sure you want to redeem "${reward.name}" for ${reward.pointsRequired} XP?`)) {
      return;
    }
    
    try {
      setRedeeming(true);
      await gamificationApi.redeemReward(reward.id);
      alert('Reward redeemed successfully! Our team will process your request shortly.');
      fetchData(); // Refresh stock and history
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to redeem reward. Make sure you have enough XP!');
    } finally {
      setRedeeming(false);
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
            <Gift className="w-8 h-8 mr-3 text-coral" />
            Rewards Store
          </h1>
          <p className="mt-2 text-text-muted">Exchange your hard-earned XP for company perks, merchandise, and time off.</p>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center px-5 py-3 rounded-xl shadow-soft font-medium transition-all duration-250 hover:scale-[1.02] ${
            showHistory 
              ? 'bg-sage text-white' 
              : 'bg-app-card border border-border-soft text-text-main hover:bg-cream'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 mr-2 ${showHistory ? 'text-white' : 'text-mauve'}`} />
          {showHistory ? 'View Store' : 'My Redemptions'}
        </button>
      </div>

      {showHistory ? (
        <div className="bg-app-card rounded-2xl shadow-soft border border-border-soft overflow-hidden">
          <div className="px-8 py-6 border-b border-border-soft bg-app-bg flex items-center">
            <ShoppingBag className="w-5 h-5 mr-3 text-coral" />
            <h2 className="text-lg font-display font-bold text-text-main">Redemption History</h2>
          </div>
          <div className="divide-y divide-border-soft">
            {redemptions.length === 0 ? (
              <div className="p-16 text-center text-text-muted">You haven't redeemed any rewards yet.</div>
            ) : (
              redemptions.map((redemption) => (
                <div key={redemption.id} className="p-8 flex items-center justify-between hover:bg-cream/40 transition-colors duration-250">
                  <div className="flex items-center space-x-6">
                    <div className="p-4 rounded-2xl bg-peach/20 text-[#D97D4B]">
                      <Gift className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-text-main text-lg">{redemption.reward?.name || 'Unknown Reward'}</p>
                      <div className="flex items-center text-sm text-text-muted mt-2 font-medium">
                        <Clock className="w-4 h-4 mr-2 text-mauve" />
                        Redeemed on {new Date(redemption.redeemedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-sage/10 text-sage mb-3">
                      <Star className="w-4 h-4 mr-1.5" />
                      {redemption.pointsSpent} XP Spent
                    </span>
                    <div>
                      <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg ${
                        redemption.status === 'PENDING' ? 'bg-state-info/10 text-state-info border border-state-info/20' :
                        redemption.status === 'FULFILLED' ? 'bg-state-success/10 text-state-success border border-state-success/20' :
                        'bg-state-error/10 text-state-error border border-state-error/20'
                      }`}>
                        {redemption.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-app-card rounded-2xl shadow-soft border border-border-soft overflow-hidden hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1 flex flex-col group">
              <div className="h-48 bg-gradient-to-br from-peach/20 to-cream/50 flex items-center justify-center border-b border-border-soft relative overflow-hidden">
                {reward.imageUrl ? (
                  <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover" />
                ) : (
                  <Gift className="w-20 h-20 text-coral/40 group-hover:scale-110 transition-transform duration-300" />
                )}
                {reward.stock <= 5 && reward.stock > 0 && (
                  <div className="absolute top-4 left-4 bg-state-error text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    Only {reward.stock} left!
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-display font-bold text-text-main mb-3">{reward.name}</h3>
                <p className="text-text-muted text-sm mb-8 flex-1 line-clamp-3 leading-relaxed">{reward.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border-soft">
                  <span className="flex items-center text-2xl font-display font-bold text-text-main">
                    {reward.pointsRequired}
                    <Star className="w-6 h-6 ml-2 text-coral fill-current" />
                  </span>
                  
                  <button 
                    onClick={() => handleRedeem(reward)}
                    disabled={redeeming || reward.stock === 0}
                    className={`px-6 py-3 font-semibold rounded-xl transition-all duration-250 shadow-sm flex items-center ${
                      reward.stock === 0
                        ? 'bg-app-bg text-text-muted cursor-not-allowed border border-border-soft'
                        : 'bg-coral hover:bg-coral-dark text-white hover:scale-[1.02]'
                    }`}
                  >
                    {reward.stock === 0 ? 'Out of Stock' : 'Redeem'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
