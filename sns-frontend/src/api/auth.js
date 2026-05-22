import api from './axios';

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data; // { jwt }
};

export const register = async (username, password) => {
  const response = await api.post('/user', { username, password });
  return response.data; // { id, username }
};
