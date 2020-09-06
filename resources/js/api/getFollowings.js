import axios from 'axios';
import { API_CONFIG } from './config';

/**
 * @param username
 * @returns {Promise<AxiosResponse<T>>}
 */
export default function (username = null, start = 0, length = 100) {
  return axios.get(`${API_CONFIG.url}/get_followings/${username ? username : null}?start=${start}&length=${length}`);
};
