import Vue from 'vue';
import store from '@/store';

// When the request succeeds
const success = (data) => {
  store.dispatch('myFollowing/getFollowingTypes', data);
};

// When the request fails
const failed = () => {};

export default () => {
  Vue.$http.get('/MemberSubscriptions/CanSubscriptionObjs').then((response) => {
    success(response.data);
  })
  .catch((error) => {
    failed(error);
  });
};
