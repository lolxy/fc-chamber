/* ============
 * Contact List
 * ============
 */

import Vue from 'vue';
import store from '@/store';

import formatMyFriendsList from '@/services/my/friends/formatMyFriendsList';
import formatMyFriendGroups from '@/services/my/friends/formatMyFriendGroups';

export default {
  data() {
    return {
      currentFriend: {},
      currentGroupId: null,
      currentEditFriend: {},
      currentTeamId: null,
      teamListVisible: false,
      addTeamMembersDialogVisible: false,
      addFriendDialogVisible: false,
      myFriendList: [],
      myFriendGroup: []
    };
  },
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    addFriend: require('@/components/contact/addFriend/main.vue'),
    userProfile: require('@/components/contact/userProfile/item.vue'),
    teamProfile: require('@/components/contact/teamProfile/item.vue'),
    teamMembersManager: require('@/components/contact/teamMembersManager/item.vue'),
    mainMenu: require('@/components/contact/mainMenu/main.vue'),
  },
  computed: {
    sessions() {
      return this.$store.state.nim.sessions;
    },
    teams() {
      return this.$store.state.nim.teams;
    },
    teamsCount() {
      return _.size(this.$store.state.nim.teams);
    },
    meId() {
      return localStorage.getItem('meId');
    },
    activePanel() {
      return store.state.contact.activePanel;
    },
  },
  watch: {
    activePanel() {
      if (!this.myFriendList.length) {
        this.myFriendList = formatMyFriendsList();
      }
      if (!this.myFriendGroup.length) {
        this.myFriendGroup = formatMyFriendGroups();
      }
    }
  },
  methods: {
    switchCurrentGroup(groupId) {
      if (this.currentGroupId === groupId) {
        this.currentGroupId = null;
      } else {
        this.currentGroupId = groupId;
        self.currentFriend = {};
      }
      this.teamListVisible = false;
    },
    switchCurrentFriend(friend) {
      this.currentFriend = friend;
      this.currentTeamId = null;
    },
    switchCurrentTeamId(teamId) {
      this.currentTeamId = teamId;
      this.currentFriend = {};
      if (this.sessions[`team-${teamId}`]) {
        if (!this.sessions[`team-${teamId}`].hasSyncTeammembers) {
          window.nim.getTeamMembers({
            teamId: teamId,
            done(error, obj) {
              if (!error) {
                store.dispatch('nim/mergeNimTeamMembers', obj);
                store.dispatch('nim/setSessionSyncTeammbersDone', state.currentSession.id);
              }
            }
          });
        }
      } else {
        window.nim.getTeamMembers({
          teamId: teamId,
          done(error, obj) {
            if (!error) {
              store.dispatch('nim/mergeNimTeamMembers', obj);
              store.dispatch('nim/setSessionSyncTeammbersDone', state.currentSession.id);
            }
          }
        });
      }
    },
    showTeamList() {
      this.teamListVisible = !this.teamListVisible;
      this.currentFriend = {};
      this.currentGroupId = null;
    },
    deleteThisFriend(user) {
      this.$confirm('此操作将永久删除该好友, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$http.delete(`/Friends/${user.Id}`).then((response) => {
          store.dispatch('nim/deleteMyFriend', user.Id);
          this.$notify({
            title: '删除成功',
            message: `好友${user.Friend.Name}已被删除!`,
            type: 'success',
            offset: 50
          });
        });
      })
    },
    openAddTeamMemberesDialog() {
      this.addTeamMembersDialogVisible = true;
    },
    closeAddTeamMemberesDialog() {
      this.addTeamMembersDialogVisible = false;
    },
    openAddFriendDialog() {
      this.addFriendDialogVisible = true;
    },
    closeAddFriendDialog() {
      this.addFriendDialogVisible = false;
    },
  },
};

