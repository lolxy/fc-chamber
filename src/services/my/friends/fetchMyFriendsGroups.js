import Vue from 'vue';
import store from '@/store';
import _ from 'lodash';

// When the request succeeds
const success = (groups) => {
  const allGroup = {
    Id: 'all',
    Name: '全部联系人',
    Ordering: 0,
  };
  const friendGroups = _.concat(allGroup, groups);
  window.myFriendGroups = friendGroups;
  store.dispatch('myFriends/setFriendsGroupLoaded');
};

// When the request fails
const failed = () => {
};

export default (meId) => {
  Vue.$http.get('/My/FriendGroups', {
    params: {
      fields: 'NoGroup,ColleagueGroup',
      'meId': meId,
    },
  }).then((response) => {
    success(response.data);
  })
  .catch((error) => {
    failed(error);
  });
};
