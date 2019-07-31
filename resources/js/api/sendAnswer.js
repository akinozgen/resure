import axios from 'axios';
import {API_CONFIG} from './config';

/**
 * @returns {Promise<AxiosResponse<T>>}
 */
export default function ({id, answer}) {
    return axios({
        url: `${API_CONFIG.url}/send_answer`,
        method: 'post',
        data: {
            id, answer
        }
    });
};
