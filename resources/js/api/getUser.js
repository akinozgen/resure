import axios from 'axios';
import { API_CONFIG } from './config';

/**
 * @param username
 * @returns {Promise<AxiosResponse<T>>}
 */
export default function (username = null) {
  return axios.get(`${API_CONFIG.url}/get_user/${username ? username : null}`);
};