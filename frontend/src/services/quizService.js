import api from './api';

export const quizService = {
  async createQuiz(data) {
    return await api.post('/quizzes', data);
  },

  async updateQuiz(id, data) {
    return await api.put(`/quizzes/${id}`, data);
  },

  async deleteQuiz(id) {
    return await api.delete(`/quizzes/${id}`);
  },

  async getMyQuizzes() {
    return await api.get('/quizzes/my-quizzes');
  },

  async getQuizByShareCode(shareCode) {
    return await api.get(`/quizzes/share/${shareCode}`);
  },

  async getQuizSummary(id) {
    return await api.get(`/quizzes/${id}/summary`);
  },

  async getQuizDetails(id) {
    return await api.get(`/quizzes/${id}/details`);
  },
};
