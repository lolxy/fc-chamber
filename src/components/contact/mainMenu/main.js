/* ============
 * Contact Menu
 * ============
 */

import store from '@/store';

export default {
  computed: {
    activePanel() {
      return store.state.contact.activePanel;
    },
    msgUnreadCount() {
      return this.$store.state.nim.unreadCount;
    },
  },
  methods: {
    openContactPanel(name) {
      store.dispatch('contact/toggleContactPanel', true);
      store.dispatch('contact/switchContactPanel', name);
    },
    closeContactPanel() {
      store.dispatch('contact/toggleContactPanel', false);
    }
  }
};

