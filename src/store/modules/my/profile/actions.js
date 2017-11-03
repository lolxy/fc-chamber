/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from './mutation-types';

export const getMyProfile = ({ commit }, profile) => {
  commit(types.GET_MY_PROFILE, profile);
};

export default {
  getMyProfile,
};
