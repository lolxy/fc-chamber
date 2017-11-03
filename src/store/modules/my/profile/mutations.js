import {
  GET_MY_PROFILE,
} from './mutation-types';

export default {
  [GET_MY_PROFILE](state, profile) {
    state.info = profile;
  },
};
