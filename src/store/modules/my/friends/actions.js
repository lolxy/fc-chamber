/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from './mutation-types';

export const setFriendsLoaded = ({ commit }) => {
  commit(types.SET_FRIENDS_LOADED);
};

export const setFriendsGroupLoaded = ({ commit }) => {
  commit(types.SET_FRIENDS_GROUP_LOADED);
};

export const setColleaguelistLoaded = ({ commit }) => {
  commit(types.SET_COLLEAGUELIST_LOADED);
};

export default {
  setFriendsLoaded,
  setFriendsGroupLoaded,
  setColleaguelistLoaded
};
