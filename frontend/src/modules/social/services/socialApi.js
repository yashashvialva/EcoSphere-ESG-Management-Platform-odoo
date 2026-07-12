import api from '../../../services/api';

export const socialApi = {
  // CSR Activities
  getCsrActivities: (params) => 
    api.get('/social/csr-activities', { params }).then(res => res.data),
    
  getCsrActivity: (id) => 
    api.get(`/social/csr-activities/${id}`).then(res => res.data.data),
    
  createCsrActivity: (data) => 
    api.post('/social/csr-activities', data).then(res => res.data.data),
    
  updateCsrActivity: (id, data) => 
    api.patch(`/social/csr-activities/${id}`, data).then(res => res.data.data),

  // Participations
  joinCsrActivity: (activityId, proofUrl) => 
    api.post('/social/participation', { activityId, proofUrl }).then(res => res.data.data),
    
  getParticipationsByActivity: (activityId) => 
    api.get(`/social/participation/activity/${activityId}`).then(res => res.data.data),
    
  evaluateParticipation: (id, status, pointsAwarded) => 
    api.patch(`/social/participation/${id}/evaluate`, { status, pointsAwarded }).then(res => res.data.data),

  // Trainings
  getTrainings: () => 
    api.get('/social/training').then(res => res.data.data),
    
  completeTraining: (id, score) => 
    api.post(`/social/training/${id}/complete`, { score }).then(res => res.data.data),

  // Diversity Metrics
  getDiversitySummary: (departmentId) => 
    api.get('/social/diversity-metrics/summary', { params: { departmentId } }).then(res => res.data.data),
    
  addDiversityMetric: (data) => 
    api.post('/social/diversity-metrics', data).then(res => res.data.data),
};
