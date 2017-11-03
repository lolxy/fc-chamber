import Vue from 'vue';
import myService from '@/services/my';
import store from '@/store';

// When the request succeeds
const success = (user) => {
  store.dispatch('auth/login');
  localStorage.setItem('userId', user.Id);
  store.dispatch('myProfile/getMyProfile', user);
  myService.init();
};

export default (user) => {
  Vue.$http.post('/Account/Login', user).then((response) => {
    success(response.data);
  }).catch((error) => {
    if (error) {
      Vue.prototype.$notify({
        title: '登录失败',
        message: `${error.response.data.Message}`,
        type: 'error',
        offset: 50
      });
    }
  });
};
