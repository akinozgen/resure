import axios from 'axios';
import { API_CONFIG } from './config';

/**
 * @returns {Promise<AxiosResponse<T>>}
 */
export default function () {
  return axios.get(`${API_CONFIG.url}/get_latest_users/`);
};