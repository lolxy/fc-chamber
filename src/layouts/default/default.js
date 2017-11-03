/* ============
 * Default Layout
 * ============
 *
 * Used for the home and account pages
 *
 * Layouts are used to store a lot of shared code.
 * This way the app stays clean.
 */

import authService from '@/services/auth';

export default {
  data() {
    return {
      showGoTopBtn: false,
    }
  },
  components: {
    VTopbar: require('@/components/topbar/main.vue'),
    VNavbar: require('@/components/navbar/main.vue'),
    homeTopSection: require('@/components/home/topSection/item.vue'),
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    routeRoot() {
      return this.$store.state.route.name.split('.')[0];
    },
    auth() {
      return this.$store.state.auth.authenticated;
    },
    pageClass() {
      const paths = this.$store.state.route.fullPath.split('/');
      let pageClass = `page-${paths[1]}`;
      if (paths.length > 2) {
        pageClass = `page-${paths[1]}-${paths[2]}`;
      }
      return pageClass;
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    logout() {
      authService.logout();
    },
    handleScroll () {
      if ( window.scrollY > 800 ) {
        this.showGoTopBtn = true;
      } else {
        this.showGoTopBtn = false;
      }
    },
    goTop: function() {
      window.scrollTo(0, 0);
      return false;
    }
  },
};
