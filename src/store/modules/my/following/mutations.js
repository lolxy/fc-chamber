import {
  GET_FOLLOWING_LIST,
  DELETE_FOLLOWING_LIST,
  GET_FOLLOWING_TYPES,
} from './mutation-types';

import Vue from 'vue';

export default {
  [GET_FOLLOWING_LIST](state, list) {
    state.list = list;
  },
  [DELETE_FOLLOWING_LIST](state, itemId) {
    state.list = state.list.filter(item => item.Id !== itemId);
  },
  [GET_FOLLOWING_TYPES](state, typesList) {
    typesList.forEach((item) => {
      Vue.set(state.types, `${item.TypeCode}`, item);
    });
  },
};
