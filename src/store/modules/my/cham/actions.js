import * as types from './mutation-types';

export const getMyCham = ({ commit }, data) => {
  commit(types.GET_MY_CHAM, data);
};

export const resetMyCham = ({ commit }) => {
  commit(types.RESET_MY_CHAM);
};

export default {
  getMyCham,
  resetMyCham,
};
