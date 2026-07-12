import api from '../../../services/api';

const environmentalApi = {
  // Emission Factors
  getEmissionFactors: async (params) => {
    const response = await api.get('/environmental/emission-factors', { params });
    return response; // paginated response
  },

  getEmissionFactor: async (id) => {
    const response = await api.get(`/environmental/emission-factors/${id}`);
    return response;
  },

  createEmissionFactor: async (data) => {
    const response = await api.post('/environmental/emission-factors', data);
    return response;
  },

  updateEmissionFactor: async (id, data) => {
    const response = await api.patch(`/environmental/emission-factors/${id}`, data);
    return response;
  },

  deleteEmissionFactor: async (id) => {
    const response = await api.delete(`/environmental/emission-factors/${id}`);
    return response;
  },

  // Carbon Transactions
  getCarbonTransactions: async (params) => {
    const response = await api.get('/environmental/carbon-transactions', { params });
    return response; // paginated response
  },

  createCarbonTransaction: async (data) => {
    const response = await api.post('/environmental/carbon-transactions', data);
    return response;
  },

  // ESG Goals
  getEsgGoals: async (params) => {
    const response = await api.get('/environmental/esg-goals', { params });
    return response;
  },

  createEsgGoal: async (data) => {
    const response = await api.post('/environmental/esg-goals', data);
    return response;
  },

  updateEsgGoal: async (id, data) => {
    const response = await api.patch(`/environmental/esg-goals/${id}`, data);
    return response;
  },

  deleteEsgGoal: async (id) => {
    const response = await api.delete(`/environmental/esg-goals/${id}`);
    return response;
  },

  // Product Profiles
  getProductProfiles: async (params) => {
    const response = await api.get('/environmental/product-profiles', { params });
    return response;
  },

  createProductProfile: async (data) => {
    const response = await api.post('/environmental/product-profiles', data);
    return response;
  },

  updateProductProfile: async (id, data) => {
    const response = await api.patch(`/environmental/product-profiles/${id}`, data);
    return response;
  },

  deleteProductProfile: async (id) => {
    const response = await api.delete(`/environmental/product-profiles/${id}`);
    return response;
  },

  // Dashboard
  getDashboard: async (params) => {
    const response = await api.get('/environmental/dashboard', { params });
    return response;
  },
};

export default environmentalApi;
