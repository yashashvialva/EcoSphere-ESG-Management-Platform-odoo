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
};

export default environmentalApi;
