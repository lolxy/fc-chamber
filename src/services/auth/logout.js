import Vue from 'vue';
import store from '@/store';
import Cookie from '@/utils/cookie';

export default () => {
  store.dispatch('auth/logout');

  Vue.$http.get('/Account/Logoff').then(() => {
    Vue.router.push({
      name: 'home.index',
    });
    localStorage.removeItem('meId');
    localStorage.removeItem('companyId');
    localStorage.removeItem('accid');
    localStorage.removeItem('userId');
    Cookie.delCookie('fcIdentity');
    window.location.reload(true);
  });
};
