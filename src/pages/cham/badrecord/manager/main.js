const badrecordManager = r => require.ensure([], () => r(require('@/components/cham/badrecordManager/main.vue')), 'badrecord-manager');

export default {
  name: 'cham-badrecord-manager',
  components: {
    badrecordManager: badrecordManager
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
