import * as types from './mutation-types';

export const getMyMall = ({ commit }, data) => {
  commit(types.GET_MY_MALL, data);
};

export const resetMyMall = ({ commit }) => {
  commit(types.RESET_MY_MALL);
};

export default {
  getMyMall,
  resetMyMall,
};
