import api from './axios';

export const getComments = async (articleId) => {
  const response = await api.get(`/article/${articleId}/comments`);
  return response.data;
};

export const createComment = async (articleId, content) => {
  const response = await api.post(`/article/${articleId}/comments`, { content });
  return response.data;
};

export const deleteComment = async (articleId, commentId) => {
  await api.delete(`/article/${articleId}/comments/${commentId}`);
};
