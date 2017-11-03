import {
  CHECK,
  LOGIN,
  LOGOUT,
} from './mutation-types';

export default {
  [CHECK](state) {
    state.authenticated = !!localStorage.getItem('userId') || !!localStorage.getItem('meId');
  },

  [LOGIN](state) {
    state.authenticated = true;
  },

  [LOGOUT](state) {
    state.authenticated = false;
  },
};
