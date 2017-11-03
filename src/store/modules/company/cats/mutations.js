import {
  GET_COMPANY_CATS,
  GET_INDUSTRY_CATS,
  GET_INDUSTRY_TYPES,
  GET_INDUSTRY_PROPS,
} from './mutation-types';

export default {
  [GET_COMPANY_CATS](state, items) {
    state.companyCats = state.companyCats.concat(items);
    state.companyCatsLoaded = true;
  },
  [GET_INDUSTRY_CATS](state, items) {
    state.industryCats = state.industryCats.concat(items);
    state.industryCatsLoaded = true;
  },
  [GET_INDUSTRY_TYPES](state, items) {
    state.industryTypes = state.industryTypes.concat(items);
    state.industryTypesLoaded = true;
  },
  [GET_INDUSTRY_PROPS](state, items) {
    state.industryProps = state.industryProps.concat(items);
    state.industryPropsLoaded = true;
  },
};
