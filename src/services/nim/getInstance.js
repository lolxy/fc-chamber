import Vue from 'vue';
import store from '@/store';
// import authService from '@/services/auth';
import NIM from '@/assets/js/nim/NIM_Web_NIM_v4.0.0';
import _ from 'lodash';

let nimReconnectTimes = 0;

const onConnect = () => {
  // console.log('连接成功');
  nimReconnectTimes = 0;
};

const onWillReconnect = () => {
  // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
  // console.log('即将重连');
  // console.log(obj.retryCount);
  // console.log(obj.duration);
};

const nimReconnect = () => {
  const meId = localStorage.getItem('meId');
  nimReconnectTimes += 1;
  Vue.$http.get(`/Nim/GetIdCard/${meId}?refresh=true`).then((response) => {
    window.nim.setOptions({
      token: response.data.info.token
    });
    window.nim.connect();
  });
};

const onDisconnect = (error) => {
  // console.log('丢失连接');

  if (error) {
    switch (error.code) {
      case 302:
        // console.log('账号或者密码错误, 可能是token过期自动重新登录');
        if (nimReconnectTimes < 10) {
          nimReconnect();
        }
        break;
      case 417:
        // console.log('重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误');
        // authService.logout();
        break;
      case 'kicked':
        // console.log('被踢, 请提示错误后跳转到登录页面');
        // authService.logout();
        break;
      default:
        if (nimReconnectTimes < 10) {
          nimReconnect();
        }
        break;
    }
  }
};

const onError = () => {
  // console.log(error);
};

const onMyInfo = (user) => {
  store.dispatch('nim/mergeNimUsers', [user]);
};

// const onUpdateMyInfo = (user) => {
//   console.log('我的名片更新了', user);
// };

// const onUsers = (users) => {
//   console.log('收到用户名片列表', users);
// };

// const onUpdateUser = (user) => {
//   console.log('用户名片更新了', user);
// };

// const onInvalidTeams = (teams) => {
//   console.log('收到错误群列表', teams);
//   data.teams = nim.cutTeams(data.teams, teams);
//   data.invalidTeams = nim.mergeTeams(data.invalidTeams, teams);
// };

const onTeams = (teams) => {
  store.dispatch('nim/mergeNimTeams', teams);
  // onInvalidTeams(teams.invalid);
};

const onTeamMembers = (obj) => {
  store.dispatch('nim/mergeNimTeamMembers', obj);
};

const onCreateTeam = (team, owner) => {
  onTeamMembers({
    teamId: team.teamId,
    members: [owner]
  });
};

const onAddTeamMembersDone = (obj) => {
  // console.log('新增成员', obj);
  store.dispatch('nim/mergeNimTeamMembers', {
    teamId: obj.team.teamId,
    members: obj.members
  });
};

const onRemoveTeamMembersDone = (obj) => {
  // console.log('有人出群的回调, 此方法接收一个参数, 包含群信息和群成员账号', obj);
  const myAccId = localStorage.getItem('accid');
  const includeMe = _.includes(obj.accounts, myAccId);
  if (includeMe) {
    window.nim.deleteLocalSession({
      id: `team-${obj.team.teamId}`,
      done(error) {
        if (!error) {
          store.dispatch('nim/deleteNimTeam', obj.team.teamId);
        }
      }
    });
    window.nim.deleteSession({
      scene: 'team',
      to: obj.team.teamId
    });
  } else {
    store.dispatch('nim/cutNimTeamMembers', {
      accounts: obj.accounts,
      teamId: obj.team.teamId
    });
  }
};

const onDismissTeamDone = (obj) => {
  // console.log('解散群的回调, 此方法接收一个参数, 包含被解散的群id');
  window.nim.deleteLocalSession({
    id: `team-${obj.teamId}`,
    done(error) {
      if (!error) {
        store.dispatch('nim/deleteNimTeam', obj.teamId);
      }
    }
  });
  window.nim.deleteSession({
    scene: 'team',
    to: obj.teamId
  });
};

// const onSyncTeamMembersDone = () => {
//   console.log('同步群列表完成');
// };

const onUpdateTeamMember = (teamMember) => {
  // console.log('群成员信息更新了', teamMember);
  onTeamMembers({
    teamId: teamMember.teamId,
    members: [teamMember]
  });
};

const onUpdateTeamDone = (obj) => {
  store.dispatch('nim/updateNimTeamInfo', obj);
};

const onSessions = (sessions) => {
  // console.log('收到会话列表', sessions);
  store.dispatch('nim/mergeNimSessions', sessions);
};

const onUpdateSession = (session) => {
  // console.log('会话更新了', session);
  store.dispatch('nim/mergeNimSessions', [session]);
};

const onSyncDone = () => {
  // console.log('同步完成');
};

export default (nimAccid, nimToken) => {
  store.dispatch('nim/getNimSupportDbStatus', NIM.support.db);
  window.nim = NIM.getInstance({
    // debug: true,
    appKey: process.env.nimAppkey,
    account: nimAccid,
    token: nimToken,
    onconnect: onConnect,
    onwillreconnect: onWillReconnect,
    ondisconnect: onDisconnect,
    onerror: onError,
    onmyinfo: onMyInfo,
    // onupdatemyinfo: onUpdateMyInfo,
    // onusers: onUsers,
    // onupdateuser: onUpdateUser,
    onsessions: onSessions,
    onupdatesession: onUpdateSession,
    onsyncdone: onSyncDone,
    onteams: onTeams,
    onsynccreateteam: onCreateTeam,
    // onteammembers: onTeamMembers,
    // onsyncteammembersdone: onSyncTeamMembersDone,
    onupdateteammember: onUpdateTeamMember,
    onUpdateTeam: onUpdateTeamDone,
    onAddTeamMembers: onAddTeamMembersDone,
    onRemoveTeamMembers: onRemoveTeamMembersDone,
    onDismissTeam: onDismissTeamDone,
  });
};
