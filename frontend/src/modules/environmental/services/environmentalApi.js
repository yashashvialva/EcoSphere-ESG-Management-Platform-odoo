import api from '../../../services/api';

const environmentalApi = {
  // Emission Factors
  getEmissionFactors: async (params) => {
    const response = await api.get('/environmental/emission-factors', { params });
    return response.data; // paginated response
  },

  getEmissionFactor: async (id) => {
    const response = await api.get(`/environmental/emission-factors/${id}`);
    return response.data;
  },

  createEmissionFactor: async (data) => {
    const response = await api.post('/environmental/emission-factors', data);
    return response.data;
  },

  updateEmissionFactor: async (id, data) => {
    const response = await api.patch(`/environmental/emission-factors/${id}`, data);
    return response.data;
  },

  deleteEmissionFactor: async (id) => {
    const response = await api.delete(`/environmental/emission-factors/${id}`);
    return response.data;
  },

  // Carbon Transactions
  getCarbonTransactions: async (params) => {
    const response = await api.get('/environmental/carbon-transactions', { params });
    return response.data; // paginated response
  },

  createCarbonTransaction: async (data) => {
    const response = await api.post('/environmental/carbon-transactions', data);
    return response.data;
  },

  // ESG Goals
  getEsgGoals: async (params) => {
    const response = await api.get('/environmental/esg-goals', { params });
    return response.data;
  },

  createEsgGoal: async (data) => {
    const response = await api.post('/environmental/esg-goals', data);
    return response.data;
  },

  updateEsgGoal: async (id, data) => {
    const response = await api.patch(`/environmental/esg-goals/${id}`, data);
    return response.data;
  },

  deleteEsgGoal: async (id) => {
    const response = await api.delete(`/environmental/esg-goals/${id}`);
    return response.data;
  },

  // Product Profiles
  getProductProfiles: async (params) => {
    const response = await api.get('/environmental/product-profiles', { params });
    return response.data;
  },

  createProductProfile: async (data) => {
    const response = await api.post('/environmental/product-profiles', data);
    return response.data;
  },

  updateProductProfile: async (id, data) => {
    const response = await api.patch(`/environmental/product-profiles/${id}`, data);
    return response.data;
  },

  deleteProductProfile: async (id) => {
    const response = await api.delete(`/environmental/product-profiles/${id}`);
    return response.data;
  },
};

export default environmentalApi;
