import api from './api';

export const attemptService = {
  async startAttempt(quizId, passcode) {
    return await api.post(`/attempts/start/${quizId}`, passcode ? { passcode } : {});
  },

  async submitAttempt(attemptId, data) {
    return await api.post(`/attempts/${attemptId}/submit`, data);
  },

  async getAttemptResult(attemptId) {
    return await api.get(`/attempts/${attemptId}/result`);
  },

  async getAttemptHistory() {
    return await api.get('/attempts/history');
  },
};
