import {
  SWITCH_CONTACT_PANEL,
  TOGGLE_CONTACT_PANEL,
} from './mutation-types';

import store from '@/store';

export default {
  [SWITCH_CONTACT_PANEL](state, panel) {
    state.activePanel = panel;
  },
  [TOGGLE_CONTACT_PANEL](state, boolean) {
    state.panelVisible = boolean;

    if (store.state.auth.authenticated) {
      if (state.panelVisible) {
        const sid = store.state.nim.currentSession.id;
        if (sid) {
          window.nim.resetSessionUnread(sid);
          window.nim.setCurrSession(sid);
        }
      } else {
        window.nim.resetCurrSession();
      }
    }
  },
};
