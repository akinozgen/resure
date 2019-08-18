import axios from 'axios';
import { API_CONFIG } from './config';

export default function (user_id = null, selects = null, newOnly = false) {
  return axios.get(`${API_CONFIG.url}/get_questions/${user_id ? user_id : null}/${selects ? selects : null}?newOnly=${(newOnly).toString()}`);
};