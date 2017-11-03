import {
  GET_MY_IDENTITIES,
  UPDATE_MY_IDENTITY,
  SET_MY_IDENTITIES_LOADED,
} from './mutation-types';

export default {
  [GET_MY_IDENTITIES](state, identities) {
    state.list = identities.filter(item => item.CompanyId);
  },
  [UPDATE_MY_IDENTITY](state, identity) {
    const companyId = localStorage.getItem('companyId');
    const currIdentity = state.list.filter(item => item.CompanyId === companyId);
    if (currIdentity.length) {
      currIdentity[0].Company[identity.handle] = identity.value;
    }
  },
  [SET_MY_IDENTITIES_LOADED](state) {
    state.loaded = true;
  },
};
