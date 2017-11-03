import {
  GET_MY_CHAM,
  RESET_MY_CHAM,
} from './mutation-types';

export default {
  [GET_MY_CHAM](state, data) {
    state.cham = data;
  },
  [RESET_MY_CHAM](state) {
    state.cham = {};
  },
};
