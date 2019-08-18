import axios from 'axios';
import {API_CONFIG} from './config';

/**
 * @returns {Promise<AxiosResponse<T>>}
 */
export default function ({content, to_id}) {
  return axios({
    url: `${API_CONFIG.url}/send_question`,
    method: 'post',
    data: {
      question_content: content,
      to_user_id: to_id,
    }
  });
};
