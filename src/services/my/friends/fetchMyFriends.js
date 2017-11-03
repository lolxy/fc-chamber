import Vue from 'vue';
import store from '@/store';

window.myFriendsList = [];

// When the request succeeds
const success = (friends) => {
  const meId = localStorage.getItem('meId');
  const friendsList = friends.filter(item => item.MeId === meId);

  window.myFriendsList = window.myFriendsList.concat(friendsList);
  store.dispatch('myFriends/setFriendsLoaded');
};

export default (meId) => {
  function loadItems(skips) {
    Vue.$http.get('/My/Friends', {
      params: {
        fields: 'Friend,Friend.User,Friend.Company',
        'meId': meId,
        take: 150,
        skip: skips,
      },
    }).then((response) => {
      if (response.data.length === 150) {
        loadItems(skips + 150);
      }
      success(response.data);
    });
  }

  loadItems(0);
};
