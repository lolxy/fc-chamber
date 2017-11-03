import Vue from 'vue';
import _ from 'lodash';

export default () => {
  let friendList = window.myFriendsList;
  friendList = _.groupBy(friendList, friend => `group-${friend.GroupId}`);
  Vue.set(friendList, 'group-all', window.myFriendsList);
  return friendList;
};
