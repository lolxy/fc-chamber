const applyManager = r => require.ensure([], () => r(require('@/components/cham/applyManager/main.vue')), 'apply-manager');

export default {
  name: 'cham-apply-manager',
  components: {
    applyManager: applyManager
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
};
