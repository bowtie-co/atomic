import Api from '@bowtie/api';
import { navigate } from 'hookrouter';
import { auth, defaults } from '.';

/**
 * Build service API wrapper
 *
 * @param {string} baseUrl - API Base URL
 * @returns {Api} API Wrapper
 */
export const buildApi = (baseUrl) => {
  const api = new Api(Object.assign({}, defaults.apiConfig, { root: baseUrl }));

  api.on('401', (resp) => {
    console.warn('401 - Unauthorized. Logout and login to renew session token(s).');
    auth.logout();
    navigate('/');
  });

  return api;
};
