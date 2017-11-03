/* ============
 * User Profile
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';

export default {
  data() {
    return {
      currentUser: {},
      friendRecentStreams: {},
    }
  },
  props: [
    'user',
    'userId'
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  mounted() {
    if (this.user) {
      this.currentUser = this.user;
    }
    if (this.userId) {
      this.getFriendProfileById(this.userId);
    }
  },
  watch: {
    user(nUser, oUser) {
      this.currentUser = this.user;
    },
    userId(nUserId, oUserId) {
      this.getFriendProfileById(this.userId);
    }
  },
  methods: {
    goToPage(pageName, pageId) {
      this.$emit('close');
      store.dispatch('contact/toggleContactPanel', false);
      this.$router.push({ name: pageName, params: { id: pageId }});
    },
    getFriendProfileById(userId) {
      Vue.$http.get(`/Employees/${userId}`, {
        params: {
          fields: 'Company,User',
        },
      }).then((response) => {
        this.currentUser = response.data;
      }).catch((error) => {
        this.currentUser = {};
        this.$notify({
          type: 'error',
          title: '出错啦!',
          message: '找不到该用户',
          offset: 50,
        });
      })
    },
    getRecentStreamByFriend(friendId) {
      const self = this;
      Vue.$http.get('/EmployeeTalks', {
        params: {
          fields: 'Sender,Images',
          'args.take': 3,
          'args.minImgCount': 1,
          'args.senderId': friendId,
        }
      }).then((response) => {
        self.friendRecentStreams = Object.assign({}, self.friendRecentStreams, {
          [friendId]: response.data
        });
      });
    },
    insertSession(accid) {
      const self = this;
      window.nim.insertLocalSession({
        scene: 'p2p',
        to: accid,
        done(error, session) {
          store.dispatch('nim/switchNimCurrentSession', `p2p-${accid}`);
          store.dispatch('contact/switchContactPanel', 'contact.sessions');
          store.dispatch('contact/toggleContactPanel', true);
        }
      });
      this.$emit('close');
    },
  },
};
