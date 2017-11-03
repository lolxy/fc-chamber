import Vue from 'vue';
import store from '@/store';

// When the request succeeds
const success = (user) => {
  store.dispatch('myProfile/getMyProfile', user);
  localStorage.setItem('userId', user.Id);
};

// When the request fails
const failed = () => {};

export default (userId) => {
  Vue.$http.get(`/Account/${userId}`).then((response) => {
    success(response.data);
  }).catch((error) => {
    failed(error);
  });
};
