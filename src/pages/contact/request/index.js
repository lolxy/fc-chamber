/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */

import Vue from 'vue';
import store from '@/store';
import fetchMyFriends from '@/services/my/friends/fetchMyFriends';

export default {
  data() {
    return {
      currentGroupId: 1,
      groups: [
        {
          id: 1,
          name: '收到的请求',
        },
        {
          id: 2,
          name: '发出的请求',
        },
      ],
      receiveList: [],
      sendList: [],
    };
  },
  computed: {
    latestReceiveList() {
      const list = this.receiveList.filter(item => item.Status === 0);
      if (list.length) {
        return list;
      }
      return [];
    }
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    Avatar: require('@/components/avatar/avatar.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  mounted() {
    this.fetchReceiveRequests();
    this.fetchSendRequests();
  },
  methods: {
    fetchReceiveRequests() {
      const meId = localStorage.getItem('meId');
      Vue.$http.get('/My/FriendRequests/Receive', {
        params: {
          fields: 'Sender,Sender.User,Sender.Company,Group',
          'args.take': 30,
        },
      }).then((response) => {
        this.receiveList = this.receiveList.concat(response.data).filter(item => item.ReceiverId === meId);
      });
    },
    fetchSendRequests() {
      const meId = localStorage.getItem('meId');
      Vue.$http.get('/My/FriendRequests/Send', {
        params: {
          fields: 'Receiver,Receiver.User,Receiver.Company,Group',
          'args.take': 30,
        },
      }).then((response) => {
        this.sendList = this.sendList.concat(response.data).filter(item => item.SenderId === meId);
      });
    },
    switchGroup(groupId) {
      this.currentGroupId = groupId;
    },
    receiveStatusText(code) {
      if (code == 1) {
        return '已通过';
      }
      if (code == -1) {
        return '已拒绝';
      }
      return '同意申请';
    },
    sendStatusText(code) {
      if (code == 1) {
        return '通过申请';
      }
      if (code == -1) {
        return '申请被拒';
      }
      return '等待验证';
    },
    applyRequest(requestId) {
      Vue.$http.post('/FriendRequests/Verify?fields=Sender,Sender.User,Sender.Company,Group', {
        Id: [requestId],
        Pass: true,
        GroupId: null,
      }).then((response) => {
        const meId = localStorage.getItem('meId');
        let receiveList = this.receiveList.filter(item => item.Id !== requestId).concat(response.data);
        this.receiveList =  _.sortBy(receiveList, [item => item.RequestTime]).reverse();
        fetchMyFriends(meId);
      });
    },
    deleteRequest(request, type) {
       this.$confirm('此操作将永久删除该请求, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Vue.$http.delete(`/FriendRequests/${request.Id}`)
          .then(() => {
            let userName = '';

            if (type === 1) {
              userName = request.Sender.Name;
              this.receiveList = this.receiveList.filter(item => item.Id !== request.Id);
            } else {
              userName = request.Receiver.Name;
              this.sendList = this.sendList.filter(item => item.Id !== request.Id);
            }

            this.$notify({
              title: '删除成功',
              message: `${userName}的请求已被成功删除`,
              type: 'success',
              offset: 50
            });
          })
        })
    },
  },
};
