const annualManager = r => require.ensure([], () => r(require('@/components/cham/annualManager/main.vue')), 'annual-manager');

export default {
  name: 'cham-annual-manager',
  components: {
    annualManager: annualManager
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
