import Vue from 'vue';
import store from '@/store';

export default () => {
  const myCompanyId = localStorage.getItem('companyId');
  Vue.$http.get(`${process.env.apiCham}/commerceChamber/getCommerceChamberWithCompanyId`, {
    params: {
      companyId: myCompanyId
    }
  }).then((response) => {
    localStorage.setItem('chamId', response.data.id);
    store.dispatch('myCham/getMyCham', response.data);
  }).catch(() => {
    localStorage.removeItem('chamId');
    store.dispatch('myCham/resetMyCham');
  });
};
