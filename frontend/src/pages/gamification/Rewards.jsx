import React, { useState, useEffect } from 'react';
import { Gift, Star, ShoppingBag, Clock } from 'lucide-react';
import gamificationApi from '../../services/gamification.api';
import { useAuth } from '../../context/AuthContext';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Gift className="w-8 h-8 mr-3 text-pink-500" />
            Rewards Store
          </h1>
          <p className="mt-2 text-gray-600">Exchange your hard-earned XP for company perks, merchandise, and time off.</p>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center px-4 py-2.5 rounded-lg shadow-sm font-medium transition-colors ${
            showHistory 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          {showHistory ? 'View Store' : 'My Redemptions'}
        </button>
      </div>

      {showHistory ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900">Redemption History</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {redemptions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">You haven't redeemed any rewards yet.</div>
            ) : (
              redemptions.map((redemption) => (
                <div key={redemption.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-5">
                    <div className="p-3.5 rounded-full bg-pink-50 text-pink-600">
                      <Gift className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{redemption.reward?.name || 'Unknown Reward'}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1.5 font-medium">
                        <Clock className="w-4 h-4 mr-1.5" />
                        Redeemed on {new Date(redemption.redeemedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800 mb-2">
                      <Star className="w-4 h-4 mr-1" />
                      {redemption.pointsSpent} XP Spent
                    </span>
                    <div>
                      <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-md ${
                        redemption.status === 'PENDING' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        redemption.status === 'FULFILLED' ? 'bg-green-100 text-green-700 border border-green-200' :
                        'bg-red-100 text-red-700 border border-red-200'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col group">
              <div className="h-44 bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center border-b border-gray-100 relative overflow-hidden">
                {reward.imageUrl ? (
                  <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover" />
                ) : (
                  <Gift className="w-20 h-20 text-pink-300 group-hover:scale-110 transition-transform duration-300" />
                )}
                {reward.stock <= 5 && reward.stock > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    Only {reward.stock} left!
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{reward.name}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">{reward.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
                  <span className="flex items-center text-2xl font-black text-gray-900">
                    {reward.pointsRequired}
                    <Star className="w-6 h-6 ml-2 text-yellow-500 fill-current" />
                  </span>
                  
                  <button 
                    onClick={() => handleRedeem(reward)}
                    disabled={redeeming || reward.stock === 0}
                    className={`px-5 py-2.5 font-bold rounded-xl transition-all shadow-sm flex items-center ${
                      reward.stock === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'
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
