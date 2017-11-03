import {
  GET_MY_COMPANIES,
  SET_MY_COMPANIES_LOADED,
} from './mutation-types';

export default {
  [GET_MY_COMPANIES](state, companies) {
    state.list = companies;
  },
  [SET_MY_COMPANIES_LOADED](state) {
    state.loaded = true;
  },
};
