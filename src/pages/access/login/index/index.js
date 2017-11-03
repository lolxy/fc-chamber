/* ============
 * Login Index Page
 * ============
 *
 * Page where the user can login
 */

import authService from '@/services/auth';

export default {

  data() {
    return {
      user: {
        Account: null,
        Password: null,
        RememberMe: false,
      },
    };
  },

  computed: {
    auth() {
      return this.$store.state.auth.authenticated
    },
    myIdentities() {
      return this.$store.state.myIdentities.list
    }
  },

  mounted() {
    if (this.myIdentities.length) {
      this.handleUserOnLogin(this.myIdentities[0].Id)
    }
  },

  watch: {
    myIdentities(list) {
      if (list.length) {
        this.handleUserOnLogin(list[0].Id)
      }
    }
  },

  methods: {
    login(user) {
      authService.login(user);
    },
    handleUserOnLogin(meId) {
      if (this.$route.query.redictUrl) {
        window.location.href = this.$route.query.redictUrl;
      } else {
        this.$router.push({
          name: 'home.index'
        });
      }
    }
  },

  components: {
    VLayout: require('@/layouts/default/default.vue'),
  },
};
