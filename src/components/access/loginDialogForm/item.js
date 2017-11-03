/* ============
 * Login Dialog
 * ============
 *
 */
import authService from '@/services/auth';

export default {
  data() {
    return {
      loginForm: {
        Account: null,
        Password: null,
        RememberMe: false,
      },
    }
  },
  methods: {
    login() {
      authService.login(this.loginForm);
      this.$emit('close');
    },
  },
};
