/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from './mutation-types';

export const getFollowingList = ({ commit }, list) => {
  commit(types.GET_FOLLOWING_LIST, list);
};

export const deleteFollowingList = ({ commit }, itemId) => {
  commit(types.DELETE_FOLLOWING_LIST, itemId);
};

export const getFollowingTypes = ({ commit }, typesList) => {
  commit(types.GET_FOLLOWING_TYPES, typesList);
};

export default {
  getFollowingList,
  deleteFollowingList,
  getFollowingTypes,
};
