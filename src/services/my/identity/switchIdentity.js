import Vue from 'vue';
import Cookie from '@/utils/cookie';

export default (data) => {
  if (data.meId) {
    localStorage.setItem('meId', data.meId);
    Cookie.setCookie('fcIdentity', data.meId);
  }

  if (data.companyId) {
    localStorage.setItem('companyId', data.companyId);
  }

  Vue.router.push({
    name: 'company.profile',
    params: {
      id: data.companyId
    }
  });

  setTimeout(() => {
    window.location.reload(true);
  }, 100);
};
