/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';
import store from '@/store';
import _ from 'lodash';

import formatMyFriendsList from '@/services/my/friends/formatMyFriendsList';
import formatMyFriendGroups from '@/services/my/friends/formatMyFriendGroups';

export default {
  data() {
    return {
      currentGroupId: 'all',
      addTeamMembersTmpList: []
    };
  },
  props: [
    'mode',
  ],
  computed: {
    currentSession() {
      return this.$store.state.nim.currentSession;
    },
    myAccid() {
      return localStorage.getItem('accid');
    },
    myFriendGroup() {
      return formatMyFriendGroups();
    },
    teamMembers() {
      return this.$store.state.nim.teamMembers;
    },
    teams() {
      return this.$store.state.nim.teams;
    },
    users() {
      return this.$store.state.nim.users;
    }
  },
  components: {
    Avatar: require('@/components/avatar/avatar.vue'),
  },
  mounted() {
    this.addTeamMembersTmpList = [];
  },
  methods: {
    myFriendList(groupId) {
      let friendList = formatMyFriendsList();
      friendList = friendList[`${groupId}`];
      if (friendList) {
        if (friendList.length) {
          friendList = friendList.filter(item => item.Friend.CompanyId);
        }
      }
      return friendList;
    },
    switchCurrentGroup(groupId) {
      if (this.currentGroupId === groupId) {
        this.currentGroupId = null;
      } else {
        this.currentGroupId = groupId;
      }
    },
    toggleTeamMembersTmpList(user) {
      const hasInMembersList = this.addTeamMembersTmpList.filter(item => item.Id === user.Id);
      if (!hasInMembersList.length) {
        this.addTeamMembersTmpList = this.addTeamMembersTmpList.concat(user);
      } else {
        this.addTeamMembersTmpList = this.addTeamMembersTmpList.filter(item => item.Id !== user.Id);
      }
    },
    hasInTeamMembersTmpList(userId) {
      const hasInMembersList = this.addTeamMembersTmpList.filter(item => item.Id === userId);
      if (hasInMembersList.length) {
        return true;
      }
      return false;
    },
    hasInTeamMembersList(accid) {
      const hasInMembersList = this.teamMembers[this.currentSession.id].filter(item => item.account === accid);
      if (hasInMembersList.length) {
        return true;
      }
      return false;
    },
    addNewMembersToTeam() {
      var self = this;
      let accountIds = [];
      const myNickName = this.users[`p2p-${this.myAccid}`].nick;

      this.addTeamMembersTmpList.forEach((item) => {
        accountIds.push(item.Friend.AccId);
      });

      window.nim.addTeamMembers({
        teamId: this.currentSession.to,
        accounts: accountIds,
        ps: `${myNickName}邀请你加入了群`,
        done(error, obj) {
          if (!error) {
            const tmpUserIdsGroups = _.chunk(obj.accounts, 150);
            tmpUserIdsGroups.forEach((idsGroup) => {
              window.nim.getUsers({
                accounts: idsGroup
              });
            });
          }
          self.$emit('closeTeamMembersManager');
          self.addTeamMembersTmpList = [];
        }
      });
    },
    closeTeamMembersManager() {
      this.$emit('closeTeamMembersManager');
      this.addTeamMembersTmpList = [];
    },
    createNewTeam() {
      const self = this;
      let accountIds = [];

      this.addTeamMembersTmpList.forEach((item) => {
        accountIds.push(item.Friend.AccId);
      });

      window.nim.createTeam({
        type: 'advanced',
        name: '高级群',
        joinMode: 'noVerify',
        beInviteMode: 'noVerify',
        inviteMode: 'all',
        updateTeamMode: 'manager',
        accounts: accountIds,
        done(error, obj) {
          if (!error) {
            store.dispatch('nim/mergeNimTeamMembers', {
              teamId: obj.team.teamId,
              members: [obj.owner]
            });
          }
          self.$emit('closeTeamMembersManager');
          self.addTeamMembersTmpList = [];
        }
      });
    }
  }
};
