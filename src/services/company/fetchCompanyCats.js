import Vue from 'vue';
import store from '@/store';

export default () => {
  Vue.$http.get('/CompanyCategories?TypeId=6e3cecaf-4d35-e711-80e4-da42ba972ebd&Take=100').then((response) => {
    store.dispatch('companyCats/getIndustryProps', response.data);
  });
  Vue.$http.get('/CompanyCategories?TypeId=4d2d281e-de57-e611-b281-a00b61b73b60&Take=100&fields=CompanyCount').then((response) => {
    store.dispatch('companyCats/getIndustryCats', response.data);
  });
  Vue.$http.get('/CompanyCategories?TypeId=07154e16-de57-e611-b281-a00b61b73b60&Take=100').then((response) => {
    store.dispatch('companyCats/getCompanyCats', response.data);
  });
  Vue.$http.get('/CompanyCategories?TypeId=b0d53699-dde9-e611-80e3-850a1737545e&Take=100').then((response) => {
    store.dispatch('companyCats/getIndustryTypes', response.data);
  });
};
