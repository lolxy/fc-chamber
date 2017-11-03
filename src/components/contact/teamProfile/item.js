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
      currentUserId: null,
      profileDialogVisible: false,
      teamInfoSettingsVisible: false,
      uploadTeamAvatarData: {},
      bucketHost: `${process.env.qiniuBucketHost}`,
      modifiedAvatarUrl: null,
      teamSettings: {
        joinMode: 'noVerify',
        beInviteMode: 'noVerify',
        inviteMode: 'all',
        updateTeamMode: 'manager'
      }
    }
  },
  props: [
    'teamid'
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    userProfile: require('@/components/contact/userProfile/item.vue'),
  },
  computed: {
    currentTeam() {
      return this.$store.state.nim.teams[`team-${this.teamid}`];
    },
    currentTeamMembers() {
      return this.$store.state.nim.teamMembers[`team-${this.teamid}`];
    },
    currentSession() {
      return this.$store.state.nim.currentSession;
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
    myNimInfo() {
      const myAccid = localStorage.getItem('accid');
      if (this.$store.state.nim.users[`p2p-${myAccid}`]) {
        return this.$store.state.nim.users[`p2p-${myAccid}`];
      }
      return {};
    },
    isTeamManager() {
      const currentTeam = this.teams[this.currentSession.id];
      if (currentTeam) {
        if (currentTeam.owner === this.myAccid) {
          return true;
        }
      }
      const myTeamInfo = this.currentTeamMembers.filter(member => member.account === this.myAccid);
      if (myTeamInfo.length) {
        if (myTeamInfo[0].type === 'manager') {
          return true;
        }
      }
      return false;
    }
  },
  watch: {
    currentSession() {
      this.currentUserId = null;
      this.profileDialogVisible = false;
    },
  },
  mounted() {
    if (this.teams[`team-${this.teamid}`]) {
      this.teamSettings.joinMode = this.teams[`team-${this.teamid}`].joinMode;
      this.teamSettings.beInviteMode = this.teams[`team-${this.teamid}`].beInviteMode;
      this.teamSettings.inviteMode = this.teams[`team-${this.teamid}`].inviteMode;
      this.teamSettings.updateTeamMode = this.teams[`team-${this.teamid}`].updateTeamMode;
    }
  },
  methods: {
    insertSession(teamId) {
      const self = this;
      window.nim.insertLocalSession({
        scene: 'team',
        to: teamId,
        done(error, session) {
          store.dispatch('nim/switchNimCurrentSession', `team-${teamId}`);
          store.dispatch('contact/switchContactPanel', 'contact.sessions');
          store.dispatch('contact/toggleContactPanel', true);
        }
      });
      this.$emit('insertSession');
    },
    openUserProfile(account) {
      this.currentUserId = account;
      this.profileDialogVisible = true;
    },
    openTeamMembersDialog() {
      this.$emit('openTeamMembersDialog');
    },
    noticeFormat(notice) {
      const content = JSON.parse(notice);
      if (content.length) {
        return this.jsonLowerKeys(content[0])
      }
      return {};
    },
    jsonLowerKeys(content) {
      let ret = {};
      $.map(content, (value, key) => {
        ret[key.toLowerCase()] = value;
      })
      return ret;
    },
    modifyMyTeamNick() {
      const self = this;
      this.$prompt('修改昵称', '更新群名片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (!value) {
          value = '';
        }
        window.nim.updateInfoInTeam({
          teamId: self.currentTeam.teamId,
          nickInTeam: value
        });
      }).catch(() => {});
    },
    modifyMyTeamName() {
      const self = this;
      this.$prompt('修改群名称', '更新群名片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (!value) {
          value = self.currentTeam.name;
        }
        window.nim.updateTeam({
          teamId: self.currentTeam.teamId,
          name: value,
          done(error, obj) {
            if (!error) {
              store.dispatch('nim/updateNimTeamInfo', obj);
            }
          }
        });
      }).catch(() => {});
    },
    beforeAvatarUpload(file) {
      const curr = Date.now();
      const prefix = file.lastModified.toString();
      const suffix = file.name;
      const key = encodeURI(`${curr}/${prefix}_${suffix}`);
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        const upToken = response.data.Token;
        this.uploadTeamAvatarData = {
          key,
          token: upToken,
        };
      });
    },
    handleAvatarUploadSuccess(response) {
      const self = this;
      const key = response.key;
      const avatarUrl = `${this.bucketHost}/${encodeURI(key)}`;

      self.modifiedAvatarUrl = avatarUrl;

      window.nim.updateTeam({
        teamId: self.currentTeam.teamId,
        avatar: avatarUrl,
        done(error, obj) {
          if (!error) {
            store.dispatch('nim/updateNimTeamInfo', obj);
          }
        }
      });
    },
    openTeamInfoSettings() {
      this.teamInfoSettingsVisible = !this.teamInfoSettingsVisible;
    },
    teamSettingsOnChange(value, key) {
      let obj = {};
      
      obj['teamId'] = this.teamid;
      obj[key] = value;

      let updateObj = {
        done(error, obj) {
          if (!error) {
            store.dispatch('nim/updateNimTeamInfo', obj);
          }
        }
      };

      updateObj['teamId'] = this.teamid;
      updateObj[key] = value;

      window.nim.updateTeam(updateObj);
    }
  }
};
