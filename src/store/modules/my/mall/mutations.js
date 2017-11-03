import {
  GET_MY_MALL,
  RESET_MY_MALL,
} from './mutation-types';

export default {
  [GET_MY_MALL](state, data) {
    state.mall = data;
  },
  [RESET_MY_MALL](state) {
    state.mall = {};
  },
};
