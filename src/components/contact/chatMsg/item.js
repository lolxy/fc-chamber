/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';

import formatMyFriendsList from '@/services/my/friends/formatMyFriendsList';

export default {
  data() {
    return {
      currentUserId: null,
      profileDialogVisible: false,
      msgImagesGallery: [],
      addFriendDialogVisible: false,
      addFriendFrom: {
        requestMsg: ''
      },
    }
  },
  props: [
    'sid',
  ],
  computed: {
    users() {
      return this.$store.state.nim.users;
    },
    myAccid() {
      return localStorage.getItem('accid');
    },
    currentSession() {
      return this.$store.state.nim.currentSession;
    },
    messages() {
      return this.$store.state.nim.sessions[this.sid].messages;
    },
    myFriendList() {
      return formatMyFriendsList();
    }
  },
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    chatMsgItem: require('@/components/contact/chatMsgItem/item.vue'),
    userProfile: require('@/components/contact/userProfile/item.vue'),
  },
  methods: {
    addFriend() {
      const self = this;
      const meId = localStorage.getItem('meId');
      let me = this.$store.state.myIdentities.list.filter(item => item.Id === meId);
      if (me.length) {
        me = me[0];
      } else {
        me = this.$store.state.myProfile.info;
      }
      if (me.CompanyId) {
        self.addFriendFrom.requestMsg = `我是《${me.Company.BrandName}》${me.JobTitle} - ${me.Name}，希望加你为好友!`;
      } else {
        self.addFriendFrom.requestMsg = `我是${me.RealName}，希望加你为好友!`;
      }

      self.addFriendDialogVisible = true;
    },
    sendFriendRequest() {
      const self = this;
      const meId = localStorage.getItem('meId');
      Vue.$http.get(`/Nim/GetEmployee/${self.currentSession.to}`).then((res) => {
        if (res.data) {
          Vue.$http.post('/FriendRequests/Add', {
            SenderId: meId,
            ReceiverId: res.data.Id,
            GroupId: null,
            RequestMsg: self.addFriendFrom.requestMsg
          }).then(() => {
            this.$notify({
              title: '已发送添加好友请求',
              message: '请耐心等待对方通过',
            });
            self.addFriendDialogVisible = false;
          })
        }
      })
    },
    checkNotOfficial(lastMsg) {
      if (lastMsg) {
        if (lastMsg.fromClientType === 'Server') {
          return false;
        }
        return true;
      }
      return true;
    },
    isFriend(accid) {
      const friend = this.myFriendList['group-all'].filter(item => item.Friend.AccId === accid);
      if (friend.length) {
        return true;
      }
      return false;
    },
    openUserProfile(message) {
      if (message.fromClientType !== 'Server') {
        this.currentUserId = message.from;
        this.profileDialogVisible = true;
      }
    },
    initMsgImagesGallery(msgs) {
      const imageMessages = msgs.filter(item => item.type === 'image');
      if (imageMessages.length) {
        this.msgImagesGallery = [];
        imageMessages.forEach((item) => {
          this.msgImagesGallery.push({
            src: this.stripMetaUrl(item.file.url),
            w: item.file.w,
            h: item.file.h
          });
        })
      }
    },
    stripMetaUrl(url) {
      return window.nim.viewImageStripMeta({
        url: url,
        strip: true
      });
    }
  },
  watch: {
    currentSession() {
      this.currentUserId = null;
    },
    messages(nVal, oVal) {
      this.initMsgImagesGallery(nVal);
    }
  },
  mounted() {
    if (this.messages.length > 0) {
      this.initMsgImagesGallery(this.messages);
    }
  },
  directives: {
    chatScroll: {
      bind: (el, binding) => {
        let timeout;
        let scrolled = false;

        el.addEventListener('scroll', e => {
            if (timeout) window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                scrolled = el.scrollTop + el.clientHeight + 1 < el.scrollHeight;
            }, 200);
        });

        (new MutationObserver(e => {
            let config = binding.value || {};
            let pause = config.always === false && scrolled;
            if (pause || e[e.length - 1].addedNodes.length != 1) return;
            el.scrollTop = el.scrollHeight;
        })).observe(el, {childList: true});
      },
      inserted: (el) => {
        el.scrollTop = el.scrollHeight;
      },
      update: (el) => {
        let timeout;
        if (timeout) window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          el.scrollTop = el.scrollHeight;
        }, 30);
      },
    }
  }
};
