import fetchMyIdentity from './identity/fetchMyIdentity';
import fetchMyCompany from './company/fetchMyCompany';
import switchIdentity from './identity/switchIdentity';
import resetIdentity from './identity/resetIdentity';

const init = () => {
  fetchMyIdentity();
  fetchMyCompany();
};

export default {
  init,
  switchIdentity,
  resetIdentity,
};
