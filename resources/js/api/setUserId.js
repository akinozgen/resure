import axios from 'axios';
import {API_CONFIG} from './config';

/**
 * @returns {Promise<AxiosResponse<T>>}
 */
export default function ({userId}) {
  return axios({
    url: `${API_CONFIG.url}/set_user_id`,
    method: 'post',
    data: {
      userId
    }
  });
};
