import api from './api';

export const authService = {
  async register(data) {
    return await api.post('/auth/register', data);
  },

  async login(data) {
    return await api.post('/auth/login', data);
  },

  async getCurrentUser() {
    return await api.get('/auth/me');
  },
};
