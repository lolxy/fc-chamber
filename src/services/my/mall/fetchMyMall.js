import Vue from 'vue';
import store from '@/store';

export default () => {
  const myCompanyId = localStorage.getItem('companyId');
  Vue.$http.get(`${process.env.apiMall}/mall/getMallWithCompanyId`, {
    params: {
      companyId: myCompanyId
    }
  }).then((response) => {
    localStorage.setItem('mallId', response.data.id);
    store.dispatch('myMall/getMyMall', response.data);
  }).catch(() => {
    localStorage.removeItem('mallId');
    store.dispatch('myMall/resetMyMall');
  });
};
