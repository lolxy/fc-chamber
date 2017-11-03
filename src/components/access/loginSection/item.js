/* ============
 * Stream Item
 * ============
 *
 */
import authService from '@/services/auth';
import {popover} from 'element-ui';


export default {
  data() {
    return {
      user: {
        Account: null,
        Password: null,
        RememberMe: false,
      },
    }
  },
  components: {
    elPopover: popover
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
  },
  methods: {
    login(user) {
      authService.login(user);
    },
  },
};
