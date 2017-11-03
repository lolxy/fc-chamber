import store from '@/store';
import authService from '@/services/auth';
import topModule from '@/components/topmodule/main.vue';
import centerListModule from '@/components/centermodule/main.vue';
export default {
  name: 'home-page',
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    routeName() {
      return this.$store.state.route.name;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  components: {
    topModule,
    centerListModule
  }
}
