/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from './mutation-types';

export const getMyIdentities = ({ commit }, identities) => {
  commit(types.GET_MY_IDENTITIES, identities);
};

export const updateMyIdentity = ({ commit }, identity) => {
  commit(types.UPDATE_MY_IDENTITY, identity);
};

export const setMyIdentitiesLoaded = ({ commit }) => {
  commit(types.SET_MY_IDENTITIES_LOADED);
};

export default {
  getMyIdentities,
  updateMyIdentity,
  setMyIdentitiesLoaded,
};
