import Vue from 'vue';
import store from '@/store';

// When the request succeeds
const success = (list) => {
  store.dispatch('myFollowing/getFollowingList', list);
};

// When the request fails
const failed = () => {};

export default () => {
  const myUserId = localStorage.getItem('userId');
  Vue.$http.get('/MemberSubscriptions', {
    params: {
      userId: myUserId,
      fields: 'RelObj',
      take: 12
    },
  }).then((response) => {
    success(response.data);
  })
  .catch((error) => {
    failed(error);
  });
};
