import topModule from '@/components/topmodule/main.vue'
import centerListModule from '@/components/centermodule/main.vue'
export default {
  name: 'home-page',
  computed: {
    userProfile() {
      return this.$store.state.identity.userProfile
    }
  },
  components: {
    topModule,
    centerListModule
  }
}
