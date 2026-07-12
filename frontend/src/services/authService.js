import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // { token, user }
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data; // { token, user }
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data; // user
  },
};

export default authService;
