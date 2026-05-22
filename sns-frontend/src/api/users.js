import api from './axios';

export const getUsers = async () => {
  const response = await api.get('/user');
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/user/${userId}`);
  return response.data;
};

export const updateUser = async (userId, data) => {
  const response = await api.put(`/user/${userId}`, data);
  return response.data;
};

// Follow
export const follow = async (followeeId) => {
  const response = await api.post('/follow', { followeeId });
  return response.data;
};

export const unfollow = async (followerId, followeeId) => {
  await api.delete(`/follow/${followerId}/${followeeId}`);
};

export const getFollowList = async (followerId) => {
  const response = await api.get(`/follow/${followerId}`);
  return response.data;
};
