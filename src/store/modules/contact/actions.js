/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from './mutation-types';

export const switchContactPanel = ({ commit }, panel) => {
  commit(types.SWITCH_CONTACT_PANEL, panel);
};

export const toggleContactPanel = ({ commit }, boolean) => {
  commit(types.TOGGLE_CONTACT_PANEL, boolean);
};

export default {
  switchContactPanel,
  toggleContactPanel,
};
