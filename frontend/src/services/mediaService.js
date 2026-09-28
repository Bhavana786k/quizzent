import api from './api';

export const mediaService = {
  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
