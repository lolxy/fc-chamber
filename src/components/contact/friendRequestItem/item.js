/* ============
 * Employee List
 * ============
 *
 */
import Vue from 'vue';

export default {
  data() {
    return {
      loginDialogVisible: false,
    }
  },
  props: [
    'employees',
    'requestId',
  ],
  computed: {
    me() {
      const meId = localStorage.getItem('meId');
      const me = this.$store.state.myIdentities.list.filter(item => item.Id === meId);
      if (me.length) {
        return me[0];
      }
      return {};
    },
    auth() {
      return this.$store.state.auth.authenticated;
    },
    userId() {
      return localStorage.getItem('userId');
    }
  },
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    loginDialogForm: require('@/components/access/loginDialogForm/item.vue'),
  },
  methods: {
    applyRequest(item) {
      Vue.$http.post('/FriendRequests/Verify?fields=Sender,Sender.User,Sender.Company,Group', {
        Id: [this.requestId],
        Pass: true,
        GroupId: null,
      }).then((response) => {
        item.RelationshipOfUs = 2;
        this.$notify({
          title: '通过验证',
          message: `成功添加好友${item.Name}`,
          type: 'success',
          offset: 50
        });

        if (response.data && response.data.length) {
          const friend = response.data[0];
          const newFriend = {
            Id: friend.SenderId,
            FriendId: friend.SenderId,
            Friend: friend.Sender,
            GroupId: friend.GroupId
          }
          console.log(newFriend);
          window.myFriendsList.push(newFriend);
        }
      });
    },
  }
};
