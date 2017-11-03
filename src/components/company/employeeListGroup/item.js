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
    
  },
  methods: {
    addFriend(user) {
      if (this.auth) {
        this.postAddFriend(user);
      } else {
        this.loginDialogVisible = true;
      }
    },
    postAddFriend(user) {
      const self = this;
      let requestMsg = '';

      if (self.me.CompanyId) {
        requestMsg = `我是《${self.me.Company.BrandName}》${self.me.JobTitle} - ${self.me.Name}，希望加你为好友!`;
      } else {
        requestMsg = `我是${self.me.Name}，希望加你为好友!`;
      }

      Vue.$http.post('/FriendRequests/Add', {
        SenderId: self.me.Id,
        ReceiverId: user.Id,
        GroupId: self.groupId,
        RequestMsg: requestMsg
      }).then(() => {
        user.RelationshipOfUs = 1;
        this.$notify({
          title: '已发送添加好友请求',
          message: '请耐心等待对方通过',
          type: 'success',
          offset: 50
        });
      }).catch((error) => {
        this.$notify({
          title: '发生错误',
          message: error.response.data.Message,
          type: 'error'
        })
      });
    }
  }
};
