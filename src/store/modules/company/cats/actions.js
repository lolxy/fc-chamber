/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from './mutation-types';

export const getCompanyCats = ({ commit }, items) => {
  commit(types.GET_COMPANY_CATS, items);
};

export const getIndustryCats = ({ commit }, items) => {
  commit(types.GET_INDUSTRY_CATS, items);
};

export const getIndustryTypes = ({ commit }, items) => {
  commit(types.GET_INDUSTRY_TYPES, items);
};

export const getIndustryProps = ({ commit }, items) => {
  commit(types.GET_INDUSTRY_PROPS, items);
};

export default {
  getCompanyCats,
  getIndustryCats,
  getIndustryTypes,
  getIndustryProps,
};
