/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from './mutation-types';

export const mergeNimSessions = ({ commit }, sessions) => {
  commit(types.MERGE_NIM_SESSIONS, sessions);
};

export const mergeNimSessionMsgs = ({ commit }, messages) => {
  commit(types.MERGE_NIM_SESSION_MSGS, messages);
};

export const mergeNimUsers = ({ commit }, user) => {
  commit(types.MERGE_NIM_USERS, user);
};

export const mergeNimTeams = ({ commit }, teams) => {
  commit(types.MERGE_NIM_TEAMS, teams);
};

export const deleteNimSessions = ({ commit }, session) => {
  commit(types.DELETE_NIM_SESSION, session);
};

export const cutNimTeamMembers = ({ commit }, obj) => {
  commit(types.CUT_NIM_TEAM_MEMBERS, obj);
};

export const mergeNimTeamMembers = ({ commit }, obj) => {
  commit(types.MERGE_NIM_TEAM_MEMBERS, obj);
};

export const getNimSupportDbStatus = ({ commit }, supportStatus) => {
  commit(types.GET_NIM_SUPPORT_DB_STATUS, supportStatus);
};

export const setSessionSyncMsgsDone = ({ commit }, sessionId) => {
  commit(types.SET_SESSION_SYNC_MSG_DONE, sessionId);
};

export const switchNimCurrentSession = ({ commit }, session) => {
  commit(types.SWITCH_NIM_CURRENT_SESSION, session);
};

export const deleteNimTeam = ({ commit }, teamId) => {
  commit(types.DELETE_NIM_TEAM, teamId);
};

export const updateNimTeamInfo = ({ commit }, obj) => {
  commit(types.UPDATE_NIM_TEAM_INFO, obj);
};

export const updateNimTeamUserInfo = ({ commit }, obj) => {
  commit(types.UPDATE_NIM_TEAM_USER_INFO, obj);
};

export const setSessionSyncTeammbersDone = ({ commit }, obj) => {
  commit(types.SET_SESSION_SYNC_TEAMMEMBERS_DONE, obj);
};

export default {
  mergeNimSessions,
  mergeNimSessionMsgs,
  mergeNimUsers,
  mergeNimTeams,
  deleteNimSessions,
  cutNimTeamMembers,
  mergeNimTeamMembers,
  getNimSupportDbStatus,
  setSessionSyncMsgsDone,
  switchNimCurrentSession,
  deleteNimTeam,
  updateNimTeamInfo,
  updateNimTeamUserInfo,
  setSessionSyncTeammbersDone,
};
