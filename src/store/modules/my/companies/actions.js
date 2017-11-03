/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from './mutation-types';

export const getMyCompanies = ({ commit }, companies) => {
  commit(types.GET_MY_COMPANIES, companies);
};

export const setMyCompaniesLoaded = ({ commit }) => {
  commit(types.SET_MY_COMPANIES_LOADED);
};

export default {
  getMyCompanies,
  setMyCompaniesLoaded,
};
