/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';

export default {
  data() {
    return {
      keyword: '',
      searchResult: [],
      searchResultLoaded: false,
      receiverId: null,
      groupId: null,
    };
  },
  computed: {
    me() {
      const meId = localStorage.getItem('meId');
      const me = this.$store.state.myIdentities.list.filter(item => item.Id === meId);
      if (me.length) {
        return me[0];
      }
      return {};
    },
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    Avatar: require('@/components/avatar/avatar.vue'),
  },
  methods: {
    searchFriend() {
      const self = this;
      self.searchResultLoaded = false;
      if (self.keyword.length) {
        self.fetchUserBykeyword();
      }
    },
    fetchUserBykeyword() {
      const self = this;
      const meId = localStorage.getItem('meId');
      Vue.$http.get('/Employees', {
        params: {
          meId: meId,
          fields: 'Company,User,RelationshipOfUs',
          'args.keyword': self.keyword
        },
      }).then((response) => {
        self.searchResult = response.data;
        self.searchResultLoaded = true;
      })
    },
    addFriend(user) {
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
        user.RelationshipOfUs = 1
        this.$notify({
          type: 'success',
          title: '已发送添加好友请求',
          message: '请耐心等待对方通过',
          offset: 50
        });
      })
    }
  }
};
