import api from './api';

export const searchService = {
  async searchQuizzes(params) {
    return await api.get('/search', { params });
  },

  async getLeaderboard(quizId) {
    return await api.get(`/leaderboards/${quizId}`);
  },
};
