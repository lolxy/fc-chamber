import Vue from 'vue';

export default () => {
  localStorage.removeItem('meId');
  localStorage.removeItem('companyId');

  Vue.router.push({
    name: 'home.index'
  });

  setTimeout(() => {
    window.location.reload(true);
  }, 10);
};
