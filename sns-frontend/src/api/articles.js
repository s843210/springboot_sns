import api from './axios';

export const createArticle = async (content, imageUrl) => {
  const response = await api.post('/article', { content, imageUrl });
  return response.data;
};

export const getArticle = async (articleId) => {
  const response = await api.get(`/article/${articleId}`);
  return response.data;
};

export const updateArticle = async (articleId, content) => {
  const response = await api.put(`/article/${articleId}`, { content });
  return response.data;
};

export const deleteArticle = async (articleId) => {
  await api.delete(`/article/${articleId}`);
};

export const getArticlesByUser = async (authorId) => {
  const response = await api.get('/article', { params: { authorId } });
  return response.data;
};

export const getFeed = async (followerId) => {
  const response = await api.get('/feed', { params: { followerId } });
  return response.data;
};

export const toggleLike = async (articleId) => {
  const response = await api.post(`/article/${articleId}/like`);
  return response.data;
};

export const getLikeStatus = async (articleId) => {
  const response = await api.get(`/article/${articleId}/like`);
  return response.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data; // { imageUrl: '/uploads/uuid.jpg' }
};
