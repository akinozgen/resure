import axios from 'axios';
import { API_CONFIG } from './config';

/**
 * @param user_id
 * @returns {Promise<AxiosResponse<T>>}
 */
export default function (user_id = null, selects = null) {
  return axios.get(`${API_CONFIG.url}/get_questions/${user_id ? user_id : null}/${selects ? selects : null}`);
};