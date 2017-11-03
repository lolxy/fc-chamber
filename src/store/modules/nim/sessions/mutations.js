import {
  MERGE_NIM_SESSIONS,
  MERGE_NIM_SESSION_MSGS,
  MERGE_NIM_USERS,
  MERGE_NIM_TEAMS,
  CUT_NIM_TEAM_MEMBERS,
  MERGE_NIM_TEAM_MEMBERS,
  DELETE_NIM_SESSION,
  GET_NIM_SUPPORT_DB_STATUS,
  SET_SESSION_SYNC_MSG_DONE,
  SWITCH_NIM_CURRENT_SESSION,
  DELETE_NIM_TEAM,
  UPDATE_NIM_TEAM_INFO,
  UPDATE_NIM_TEAM_USER_INFO,
  SET_SESSION_SYNC_TEAMMEMBERS_DONE,
} from './mutation-types';

import Vue from 'vue';
import store from '@/store';
import _ from 'lodash';

export default {
  [MERGE_NIM_SESSIONS](state, sessions) {
    const tmpUserIds = [];
    sessions.forEach((session) => {
      const sId = `${session.scene}-${session.to}`;

      if (state.sessions[sId]) {
        const messages = state.sessions[sId].messages;

        if (session.lastMsg) {
          if (!messages.filter(msg => msg.idClient === session.lastMsg.idClient).length) {
            state.sessions[sId].lastMsg = session.lastMsg;
            state.sessions[sId].messages = state.sessions[sId].messages.concat(session.lastMsg);
          }
        }

        state.sessions[sId].updateTime = session.updateTime;
        state.sessions[sId].unread = session.unread;

        state.unreadCount = 0;
        _.forEach(state.sessions, (item) => {
          state.unreadCount += item.unread;
        });
      }

      if (!state.sessions[sId]) {
        Vue.set(state.sessions, `${sId}`, {
          id: sId,
          to: session.to,
          scene: session.scene,
          updateTime: session.updateTime,
          unread: session.unread,
          lastMsg: session.lastMsg,
          messages: [],
          hasSyncHistoryMsgs: false,
          hasSyncTeammembers: false
        });

        state.unreadCount += session.unread;

        if (session.scene === 'p2p') {
          tmpUserIds.push(session.to);
        }

        if (session.scene === 'team') {
          window.nim.getTeam({
            teamId: session.to,
            done(error, team) {
              if (!error) {
                store.dispatch('nim/mergeNimTeams', [team]);
              }
            }
          });
        }
      }
    });

    // 批量获取用户信息
    const tmpUserIdsGroups = _.chunk(tmpUserIds, 150);
    tmpUserIdsGroups.forEach((idsGroup) => {
      window.nim.getUsers({
        accounts: idsGroup,
        done(error, users) {
          if (!error) {
            store.dispatch('nim/mergeNimUsers', users);
          }
        }
      });
    });
  },
  [MERGE_NIM_SESSION_MSGS](state, obj) {
    let sId = obj.sessionId;
    if (obj.to) {
      sId = `${obj.scene}-${obj.to}`;
    }
    if (state.sessions[sId] && obj.msgs.length) {
      const msgs = _.sortBy(obj.msgs, [msg => msg.time]);
      Vue.set(state.sessions[sId], 'messages', msgs);
    }
  },
  [MERGE_NIM_USERS](state, users) {
    users.forEach((user) => {
      if (user) {
        const uId = `p2p-${user.account}`;
        if (state.users[uId]) {
          state.users[uId] = user;
        } else {
          Vue.set(state.users, `${uId}`, user);
        }
      }
    });
  },
  [MERGE_NIM_TEAMS](state, teams) {
    teams.forEach((team) => {
      const uId = `team-${team.teamId}`;
      if (state.teams[uId]) {
        state.teams[uId] = team;
      } else {
        Vue.set(state.teams, `${uId}`, team);
      }
    });
  },
  [DELETE_NIM_SESSION](state, session) {
    state.sessions = _.omit(state.sessions, [`${session.scene}-${session.to}`]);
    if (state.currentSession.to === session.to) {
      state.currentSession = {};
    }
  },
  [MERGE_NIM_TEAM_MEMBERS](state, obj) {
    const tmpTeamMembers = window.nim.mergeTeamMembers(state.teamMembers[`team-${obj.teamId}`], obj.members);

    if (state.teamMembers[`team-${obj.teamId}`]) {
      state.teamMembers[`team-${obj.teamId}`] = window.nim.mergeTeamMembers(state.teamMembers[`team-${obj.teamId}`], obj.members);
    } else {
      Vue.set(state.teamMembers, `team-${obj.teamId}`, tmpTeamMembers);
    }

    // 批量获取用户信息
    const temMembersIds = [];
    state.teamMembers[`team-${obj.teamId}`].forEach((member) => {
      if (member.account) {
        temMembersIds.push(member.account);
      }
    });

    const temMembersIdGroups = _.chunk(temMembersIds, 150);
    temMembersIdGroups.forEach((idsGroup) => {
      window.nim.getUsers({
        accounts: idsGroup,
        done(error, users) {
          if (!error) {
            store.dispatch('nim/mergeNimUsers', users);
          }
        }
      });
    });
  },
  [CUT_NIM_TEAM_MEMBERS](state, obj) {
    if (state.teamMembers[`team-${obj.teamId}`]) {
      state.teamMembers[`team-${obj.teamId}`] = window.nim.cutTeamMembersByAccounts(state.teamMembers[`team-${obj.teamId}`], obj.teamId, obj.accounts);
    }
  },
  [DELETE_NIM_TEAM](state, teamId) {
    store.dispatch('nim/deleteNimSessions', {
      scene: 'team',
      to: teamId
    });
    state.teams = _.omit(state.teams, [`team-${teamId}`]);
    state.teamMembers = _.omit(state.teamMembers, [`team-${teamId}`]);
  },
  [UPDATE_NIM_TEAM_INFO](state, obj) {
    const currentTeam = state.teams[`team-${obj.teamId}`];
    _.forEach(obj, (value, key) => {
      currentTeam[key] = value;
    });
  },
  [UPDATE_NIM_TEAM_USER_INFO](state, obj) {
    const cTeamMembers = state.teamMembers[`team-${obj.teamId}`];
    if (obj.updateMode === 'addTeamManagers') {
      obj.accounts.forEach((account) => {
        const cMember = cTeamMembers.filter(item => item.account === account);
        if (cMember.length) {
          cMember[0].type = 'manager';
        }
      });
    }
    if (obj.updateMode === 'removeTeamManagers') {
      obj.accounts.forEach((account) => {
        const cMember = cTeamMembers.filter(item => item.account === account);
        if (cMember.length) {
          cMember[0].type = 'normal';
        }
      });
    }
  },
  [GET_NIM_SUPPORT_DB_STATUS](state, supportStatus) {
    state.supportDB = supportStatus;
  },
  [SWITCH_NIM_CURRENT_SESSION](state, sessionId) {
    window.nim.resetCurrSession();
    state.currentSession = state.sessions[sessionId];
    window.nim.resetSessionUnread(sessionId);
    window.nim.setCurrSession(state.currentSession.id);

    if (state.supportDB) {
      if (!state.currentSession.hasSyncHistoryMsgs) {
        window.nim.getLocalMsgs({
          sessionId: state.currentSession.id,
          limit: 30,
          done(error, obj) {
            store.dispatch('nim/mergeNimSessionMsgs', obj);
            store.dispatch('nim/setSessionSyncMsgsDone', sessionId);
          }
        });
      }
    }
    if (!state.supportDB) {
      if (!state.currentSession.hasSyncHistoryMsgs) {
        window.nim.getHistoryMsgs({
          scene: `${state.currentSession.scene}`,
          to: state.currentSession.to,
          done(error, obj) {
            store.dispatch('nim/mergeNimSessionMsgs', obj);
            store.dispatch('nim/setSessionSyncMsgsDone', sessionId);
          }
        });
      }
    }

    if (state.currentSession.scene === 'team') {
      if (!state.currentSession.hasSyncTeammembers) {
        window.nim.getTeamMembers({
          teamId: state.currentSession.to,
          done(error, obj) {
            if (!error) {
              store.dispatch('nim/mergeNimTeamMembers', obj);
              store.dispatch('nim/setSessionSyncTeammbersDone', state.currentSession.id);
            }
          }
        });
      }
    }
  },
  [SET_SESSION_SYNC_MSG_DONE](state, sessionId) {
    state.sessions[sessionId].hasSyncHistoryMsgs = true;
  },
  [SET_SESSION_SYNC_TEAMMEMBERS_DONE](state, sessionId) {
    state.sessions[sessionId].hasSyncTeammembers = true;
  },
};
