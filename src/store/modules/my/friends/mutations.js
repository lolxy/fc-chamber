import {
  SET_FRIENDS_LOADED,
  SET_FRIENDS_GROUP_LOADED,
  SET_COLLEAGUELIST_LOADED
} from './mutation-types';

export default {
  [SET_FRIENDS_LOADED](state) {
    state.friendsListLoaded = true;
  },
  [SET_FRIENDS_GROUP_LOADED](state) {
    state.friendsGroupLoaded = true;
  },
  [SET_COLLEAGUELIST_LOADED](state) {
    state.colleagueListLoaded = true;
  }
};
