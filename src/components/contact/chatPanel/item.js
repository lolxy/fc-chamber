/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';
import _ from 'lodash';
import at from 'vue-at';
import Emoji from '@/services/emoji';
Emoji.initPinupList();

import formatMyFriendsList from '@/services/my/friends/formatMyFriendsList';
import formatMyFriendGroups from '@/services/my/friends/formatMyFriendGroups';

export default {
  data() {
    return {
      emojis: Emoji,
      emojiActiveName: 'emoji',
      emojisVisible: false,
      customMenuVisible: false,
      friendsCardDialogVisible: false,
      isOfficial: false,
      msg: {
        apns: [],
        text: null,
        prevText: null,
      },
      currentFriend: {},
      currentGroupId: null,
    }
  },
  props: [
    'currentSessionId',
  ],
  computed: {
    users() {
      return this.$store.state.nim.users;
    },
    myAccid() {
      return localStorage.getItem('accid');
    },
    myFriendList() {
      return formatMyFriendsList();
    },
    myFriendGroup() {
      return formatMyFriendGroups();
    },
    companyId() {
      return localStorage.getItem('companyId');
    },
    currentSession() {
      return this.$store.state.nim.sessions[this.currentSessionId];
    },
    users() {
      return this.$store.state.nim.users;
    },
    teams() {
      return this.$store.state.nim.teams;
    },
    currentTeamMembers() {
      return this.$store.state.nim.teamMembers[this.currentSessionId];
    },
    atMembers() {
      let members = [];
      members = _.map(this.users, (user) => {
        return {
          account: user.account,
          avatar: user.avatar,
          name: user.nick
        }
      })
      members = members.filter((member) => {
        const currentMember = this.currentTeamMembers.filter(item => item.account === member.account);
        if (currentMember.length) {
          return true;
        }
        return false;
      })
      return members;
    },
    me() {
      return this.atMembers.filter(member => member.account === this.myAccid);
    }
  },
  components: {
    at,
    avatar: require('@/components/avatar/avatar.vue'),
    chatMsg: require('@/components/contact/chatMsg/item.vue'),
  },
  methods: {
    checkNotOfficial(lastMsg) {
      if (lastMsg) {
        if (lastMsg.fromClientType === 'Server') {
          return false;
        }
        return true;
      }
      return true;
    },
    toggleEmojisMenu() {
      this.emojisVisible = !this.emojisVisible;
      this.customMenuVisible = false;
    },
    toggleCustomMenu() {
      this.customMenuVisible = !this.customMenuVisible;
      this.emojisVisible = false;
    },
    insertEmoji(emoji) {
      if (this.$refs.msgTextInput.innerText) {
        if (this.$refs.msgTextInput.innerText === '\n') {
          this.$refs.msgTextInput.innerText = emoji;
        } else {
          this.$refs.msgTextInput.innerText = this.$refs.msgTextInput.innerText + emoji;
        }
      } else {
        this.$refs.msgTextInput.innerText = emoji;
      }
      this.emojisVisible = false;
    },
    parseMentions(text) {
        var mentionsRegex = new RegExp('@([\u4e00-\u9fa5_a-zA-Z0-9\_\.\·]+)', 'gim');

        var matches = text.match(mentionsRegex);
        if (matches && matches.length) {
            matches = matches.map(function(match) {
                return match.slice(1);
            });
            return _.uniq(matches);
        } else {
            return [];
        }
    },
    preSendMsg(e, scene) {
      if (!e.shiftKey) {
        this.sendMsg(scene);
      }
    },
    sendMsg(scene) {
      var self = this;
      this.msg.apns = [];
      this.msg.text = JSON.stringify(self.$refs.msgTextInput.innerText).replace(/(^")|("$)/g, '');
      this.msg.text = this.msg.text.replace(/\\n/g, '');

      if (scene === 'team') {
        const mentionsNicks = this.parseMentions(this.msg.text);
        if (this.atMembers.length) {
          mentionsNicks.forEach((nick) => {
            const member = this.atMembers.filter(member => member.name === nick);
            if (member.length) {
              this.msg.apns.push(member[0].account);
            }
          });
        }
      }

      if (this.msg.apns.length) {
        window.nim.sendText({
          scene: `${self.currentSession.scene}`,
          to: self.currentSession.to,
          text: self.msg.text,
          apns: {
            accounts: this.msg.apns,
            content: `${this.me[0].name}在群里@了你`,
            forcePush: true
          },
          done(error, msg) {
            self.msg.text = null;
            self.$refs.msgTextInput.innerText = '';
          }
        });
      } else {
        window.nim.sendText({
          scene: `${self.currentSession.scene}`,
          to: self.currentSession.to,
          text: self.msg.text,
          done(error, msg) {
            self.msg.text = null;
            self.$refs.msgTextInput.innerText = '';
          }
        });
      }
    },
    sendFile(e) {
      this.sendFileMessage(this.currentSession.scene, this.currentSession.to, e.target, () => {
        e.target.form.reset();
      });
    },
    sendFileMessage(sessionScene, sessionTo, fileInput, callback) {
      const value = fileInput.value;
      const ext = value.substring(value.lastIndexOf('.') + 1, value.length);
      const fileType = /png|jpg|bmp|jpeg|gif/i.test(ext) ? 'image' : 'file';

      window.nim.sendFile({
        scene: sessionScene,
        to: sessionTo,
        type: fileType,
        fileInput: fileInput,
        pushContent: "发来了一张图片",
        // uploadprogress(data) {
        //   console && console.log(data.percentageText);
        // },
        // uploaderror() {
        //   console && console.log('上传失败');
        // },
        // uploaddone(error, file) {
        //   console.log(error);
        //   console.log(file);
        //   console.log('上传' + (!error?'成功':'失败'));
        // },
        // beforesend(msgId) {
        //   console && console.log('正在发送消息, id=' + msgId);
        // },
        done: callback
      });
    },
    sendPinupMsg(catalog, chartlet) {
      const self = this;
      const content = {
        type: "3",
        data: {
          catalog: catalog,
          chartlet: chartlet.split('.')[0]
        }
      };

      window.nim.sendCustomMsg({
        scene: self.currentSession.scene,
        to: self.currentSession.to,
        content: JSON.stringify(content),
        pushContent: "发来了一张[贴图]",
        done() {
          self.emojisVisible = false;
        }
      });
    },
    sendCompanyCard() {
      this.$confirm('是否发送您的公司名片', '发送确认', {
        confirmButtonText: '发送',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.sendCompanyCardMsg();
      }).catch(() => {});
      this.customMenuVisible = false;
    },
    sendCompanyCardMsg() {
      const self = this;
      const companyId = localStorage.getItem('companyId');
      let myCompany = this.$store.state.myCompanies.list.filter(item => item.Id === companyId);
      if (myCompany.length) {
        myCompany = myCompany[0];
      } else {
        myCompany = {};
      }
      const content = {
        type: "10",
        data: {
          logoUrl: myCompany.LogoUrl,
          address: `${myCompany.ResidentProvince}${myCompany.ResidentCity}${myCompany.ResidentArea}`,
          status: myCompany.VerifyStatus,
          companyId: myCompany.Id,
          category: myCompany.CustomMainBusiness,
          brandName: myCompany.BrandName
        }
      };

      window.nim.sendCustomMsg({
        scene: self.currentSession.scene,
        to: self.currentSession.to,
        content: JSON.stringify(content),
        pushContent: "发来了公司名片",
        done() {
          self.customMenuVisible = false;
        }
      });
    },
    sendFriendsCard(friend) {
      const self = this;
      let avatar = null;
      let phone = null;
      let name = friend.Name;
      if (friend.UserId) {
        avatar = friend.User.PortraitUrl;
        phone = friend.User.PhoneNumber;

        if (!friend.Name) {
          name = friend.User.RealName;
        }
      }
      const content = {
        type: "9",
        data: {
          employId: friend.Id,
          accId: friend.AccId,
          portraitUrl: avatar,
          phoneNumber: phone,
          userName: name
        }
      };

      window.nim.sendCustomMsg({
        scene: self.currentSession.scene,
        to: self.currentSession.to,
        content: JSON.stringify(content),
        pushContent: "发来了公司名片",
        done() {
          
        }
      });
    },
    deleteMsg(msg) {
      window.nim.deleteMsg({
        msg: msg,
        done(err) {
          if(err){
            if(err.code === 508){
              console.log('发送时间超过2分钟的消息，不能被撤回');
            } else {
              console.log(err.message||'操作失败');
            }
          }
        }
      })
    },
    switchCurrentGroup(groupId) {
      if (this.currentGroupId !== groupId) {
        this.currentGroupId = groupId;
      } else {
        this.currentFriend = {};
        this.currentGroupId = null;
      }
    },
    switchCurrentFriend(friend) {
      this.currentFriend = friend;
      this.sendCurrentFriendCard(this.currentFriend);
    },
    openFriendsCardDialog() {
      this.friendsCardDialogVisible = true;
      this.customMenuVisible = false;
    },
    sendCurrentFriendCard(friend) {
      let msg = `是否发送【${friend.Name}】的名片?`;
      if (friend.CompanyId) {
        msg = `是否发送【${friend.Company.BrandName}·${friend.Name}】的名片?`;
      }
      this.$confirm(msg, '确认提示', {
        confirmButtonText: '发送',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.sendFriendsCard(friend);
        this.friendsCardDialogVisible = false;
      }).catch(() => {});
    }
  }
};
