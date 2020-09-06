import axios from 'axios';
import { API_CONFIG } from './config';

/**
 * @param username
 * @returns {Promise<AxiosResponse<T>>}
 */
export default function (username = null, follow = true) {
  return axios.post(`${API_CONFIG.url}/follow/${username ? username : null}?follow=${follow}`);
};
