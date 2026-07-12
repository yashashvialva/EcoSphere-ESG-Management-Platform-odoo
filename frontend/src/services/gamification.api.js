import api from './api';

const gamificationApi = {
  // Challenges
  getChallenges: (params) => api.get('/gamification/challenges', { params }),
  getChallengeById: (id) => api.get(`/gamification/challenges/${id}`),
  joinChallenge: (id) => api.post(`/gamification/challenges/${id}/join`),
  submitProof: (id, data) => api.post(`/gamification/challenges/${id}/submit`, data),
  
  // Leaderboard
  getLeaderboard: (params) => api.get('/gamification/leaderboard', { params }),
  getMyXpLedger: (params) => api.get('/gamification/leaderboard/my-ledger', { params }),
  
  // Badges
  getAllBadges: (params) => api.get('/gamification/badges', { params }),
  getMyBadges: (params) => api.get('/gamification/badges/my-badges', { params }),
  
  // Rewards
  getRewards: (params) => api.get('/gamification/rewards', { params }),
  getMyRedemptions: (params) => api.get('/gamification/rewards/my-redemptions', { params }),
  redeemReward: (id) => api.post(`/gamification/rewards/${id}/redeem`)
};

export default gamificationApi;
