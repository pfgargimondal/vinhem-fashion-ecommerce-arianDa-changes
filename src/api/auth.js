import axios from 'axios';

// const API_URL = 'https://vinhem-ecommerce.workstream.club/api/user';
const API_URL = 'https://fastwork.space/api/user';

export const register = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};


export const loginAPI = async (credentials) => {
  return await axios.post(`${API_URL}/user-login`, credentials);
};