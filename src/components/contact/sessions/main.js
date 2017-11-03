/* ============
 * Contact Sessions
 * ============
 *
 * The Sessions Main
 */

import Vue from 'vue';
import store from '@/store';
import _ from 'lodash';

export default {
  data() {
    return {
      currentUserId: null,
      currentTeamId: null,
      currentCtxSession: {},
      currentTeamMemberCtxUser: {},
      profileDialogVisible: false,
      teamProfileDialogVisible: false,
      teamMembersDialogVisible: false,
      addTeamMembersDialogVisible: false,
      teamNoticeEditorDialogVisible: false,
      teamNoticeForm: {
        notice: ''
      }
    }
  },
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    chatPanel: require('@/components/contact/chatPanel/item.vue'),
    userProfile: require('@/components/contact/userProfile/item.vue'),
    teamProfile: require('@/components/contact/teamProfile/item.vue'),
    teamMembersManager: require('@/components/contact/teamMembersManager/item.vue'),
    mainMenu: require('@/components/contact/mainMenu/main.vue'),
  },
  computed: {
    currentSession() {
      return this.$store.state.nim.currentSession;
    },
    sessions() {
      const sessions = this.$store.state.nim.sessions;
      return _.sortBy(sessions, [session => session.updateTime]).reverse();
    },
    users() {
      return this.$store.state.nim.users;
    },
    teams() {
      return this.$store.state.nim.teams;
    },
    teamMembers() {
      return this.$store.state.nim.teamMembers;
    },
    myAccid() {
      return localStorage.getItem('accid');
    },
    currentTeam() {
      return this.$store.state.nim.teams[this.currentSession.id];
    },
    currentTeamMembers() {
      return this.$store.state.nim.teamMembers[this.currentSession.id];
    },
    canInvite() {
      const currentTeam = this.teams[this.currentSession.id];
      if (currentTeam.inviteMode === 'all' && this.currentTeamMembers) {
        return true;
      }
      return false;
    },
    isTeamOwner() {
      if (this.currentTeam.owner === this.myAccid) {
        return true;
      }
    },
    isTeamManager() {
      if (this.currentTeam.owner === this.myAccid) {
        return true;
      }
      if (this.currentTeamMembers) {
        const myTeamInfo = this.currentTeamMembers.filter(member => member.account === this.myAccid);
        if (myTeamInfo.length) {
          if (myTeamInfo[0].type === 'manager') {
            return true;
          }
        }
      }
      return false;
    }
  },
  methods: {
    openTeamMembersDialog() {
      this.teamProfileDialogVisible = false;
      this.teamMembersDialogVisible = true;
    },
    openContextMenu(session, event) {
      this.$refs['sessionCtxMenu'].open(event);
      this.currentCtxSession = session;
    },
    onCtxClose() {
      setTimeout(() => {
        this.currentCtxSession = {};
      }, 30);
    },
    onCtxCancel() {
      this.currentCtxSession = {};
    },
    openTeamMemberContextMenu(user, event) {
      this.$refs['teamMembersCtxMenu'].open(event);
      this.currentTeamMemberCtxUser = user;
    },
    onTeamMemberCtxClose() {
      setTimeout(() => {
        this.currentTeamMemberCtxUser = {};
      }, 30);
    },
    onTeamMemberCtxCancel() {
      this.currentTeamMemberCtxUser = {};
    },
    setThisTeamManager(user) {
      window.nim.addTeamManagers({
        teamId: user.teamId,
        accounts: [user.account],
        done(error, obj) {
          if (!error) {
            obj.updateMode = 'addTeamManagers';
            store.dispatch('nim/updateNimTeamUserInfo', obj);
          } else {
            console.log(error);
          }
        }
      });
    },
    removeThisTeamManager(user) {
      window.nim.removeTeamManagers({
        teamId: user.teamId,
        accounts: [user.account],
        done(error, obj) {
          if (!error) {
            obj.updateMode = 'removeTeamManagers';
            store.dispatch('nim/updateNimTeamUserInfo', obj);
          } else {
            console.log(error);
          }
        }
      });
    },
    removeThisTeamMember(user) {
      const self = this;
      let nickName = '';
      if (this.users[`p2p-${user.account}`]) {
        nickName = this.users[`p2p-${user.account}`].nick;
      }
      if (user.nickInTeam) {
        nickName = user.nickInTeam
      }
      this.$confirm(`是否移除成员: ${nickName}`, '移除成员', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.nim.removeTeamMembers({
          teamId: user.teamId,
          accounts: [user.account],
          done(error, obj) {
            if (!error) {
              store.dispatch('nim/cutNimTeamMembers', obj);
            } else {
              self.$notify({
                type: 'error',
                title: '操作失败',
                message: '没有权限删除该成员',
                offset: 50
              });
            }
          }
        });
      }).catch(() => {});
    },
    leaveTeam() {
      const self = this;
      const currentTeam = this.teams[this.currentSession.id];
      this.$confirm(`退出群聊将不再接收来自该群的消息`, `退出群聊：${currentTeam.name}`, {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.nim.leaveTeam({
          teamId: this.currentSession.to
        });
      }).catch(() => {});
    },
    dismissTeam() {
      const self = this;
      const currentTeam = this.teams[this.currentSession.id];
      this.$confirm(`解散群聊所有成员将被退出该群`, `解散群聊：${currentTeam.name}`, {
        confirmButtonText: '解散',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.nim.dismissTeam({
          teamId: this.currentSession.to
        });
      }).catch(() => {});
    },
    openUserProfile(account) {
      this.currentUserId = account;
      this.profileDialogVisible = true;
    },
    openTeamProfile(teamId) {
      this.currentTeamId = teamId;
      this.teamProfileDialogVisible = true;
    },
    switchSession(sessionId) {
      store.dispatch('nim/switchNimCurrentSession', sessionId);
    },
    removeSession(session) {
      nim.deleteLocalSession({
          id: `${session.scene}-${session.to}`,
          done(error, obj) {
            if (!error) {
              store.dispatch('nim/deleteNimSessions', session);
            }
          }
      });
      nim.deleteSession({
          scene: `${session.scene}`,
          to: session.to
      });
    },
    customMessage(message) {
      if (message.content) {
        const content = JSON.parse(message.content.replace(/,\r\n\s*}/g, '}'));
        if (typeof content === 'object') {
          return this.jsonLowerKeys(content);
        }
        return {};
      }
    },
    jsonLowerKeys(content) {
      let ret = {};
      $.map(content, (value, key) => {
        ret[key.toLowerCase()] = value;
      })
      return ret;
    },
    latestMsg(msg) {
      if (msg.type == 'text') {
        return msg.text;
      }
      if (msg.type == 'audio') {
        return msg.text;
      }
      if (msg.type == 'video') {
        return '[视频文件]';
      }
      if (msg.type == 'image') {
        return '[图片]';
      }
      if (msg.type == 'file') {
        return '[文件]';
      }
      if (msg.type == 'geo') {
        return '[地理位置]';
      }
      if (msg.type == 'custom') {
        if (msg.pushContent) {
          return msg.pushContent;
        } else {
          if (this.customMessage(msg).type === '3') {
            return '[贴图]';
          }
          if (this.customMessage(msg).type === '9') {
            return '[好友名片]';
          }
          if (this.customMessage(msg).type === '10') {
            return '[公司名片]';
          }
          if (this.customMessage(msg).type === '11') {
            return '[公司产品主页]';
          }
          if (this.customMessage(msg).type === 'ReceiveFriendRequest') {
            return '[新的好友请求]';
          }
          if (this.customMessage(msg).type === 'VerifyFriendRequest') {
            return '[新的朋友]';
          }
          if (this.customMessage(msg).type === 'VerifyEmployeeInvite') {
            return '[新的员工请求]';
          }
        }
        if (this.customMessage(msg).data) {
          return this.customMessage(msg).data.title;
        }
        return '未知的消息类型';
      }
      if (msg.type == 'notification') {
        if (msg.attach) {
          return '群信息更新';
        }
      }
      return msg.pushContent;
    },
    openAddTeamMemberesDialog() {
      this.addTeamMembersDialogVisible = true;
    },
    closeAddTeamMemberesDialog() {
      this.addTeamMembersDialogVisible = false;
    },
    openTeamNoticeEditorDialog() {
      this.teamNoticeForm.notice = this.currentTeam.intro;
      this.teamNoticeEditorDialogVisible = true;
    },
    closeTeamNoticeEditorDialog() {
      this.teamNoticeEditorDialogVisible = false;
    },
    saveTeamNotice() {
      const self = this;
      const introText = JSON.stringify(self.teamNoticeForm.notice).replace(/(^")|("$)/g, '');
      window.nim.updateTeam({
        teamId: self.currentTeam.teamId,
        intro: introText,
        done(error, obj) {
          if (!error) {
            store.dispatch('nim/updateNimTeamInfo', obj);
            self.teamNoticeEditorDialogVisible = false;
          }
        }
      });
    }
  },
};

